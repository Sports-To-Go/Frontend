import { createContext, useContext, FC, ReactNode, useReducer, useRef } from 'react'
import { auth } from '../firebase/firebase'
import { BACKEND_URL } from '../../integration-config'
import axios from 'axios'
import { useAuth } from './UserContext'
import { toast } from 'react-toastify'

export interface GroupPreview {
	id: number
	name: string
	memberCount?: number
	description: string
}

export interface GroupMember {
	id: string
	displayName: string
	role: string
	nickname: string | null
}

export interface JoinRequest {
	id: string
	displayName: string
}

export type SystemEventType =
	| 'JOIN_REQUEST'
	| 'USER_JOINED'
	| 'USER_LEFT'
	| 'USER_KICKED'
	| 'ROLE_CHANGED'
	| 'GROUP_CREATED'
	| 'THEME_CHANGED'
	| 'NICKNAME_CHANGED'
	| 'JOINED_GROUP'

export interface Message {
	id: number
	senderID: string
	groupID: number
	content: string
	timestamp: string
	type: 'TEXT' | 'SYSTEM'
	systemEvent?: SystemEventType
	meta?: Record<string, any>
	senderName?: string
}

export interface GroupData extends GroupPreview {
	lastMessage?: Message
	joinRequests: JoinRequest[]
	theme: string
}

interface SocialState {
	recommendations: GroupPreview[]
	groups: GroupData[]
	selectedGroup: GroupPreview | null
	messages: Map<number, Message[]>
	members: Map<number, Map<string, GroupMember>>
}

interface SocialContextType {
	state: SocialState
	connectSocial: () => void
	selectGroup: (group: GroupPreview | null) => void
	joinGroup: (groupID: number) => Promise<boolean>
	leaveGroup: (groupID: number) => void
	changeTheme: (groupID: number, theme: string) => void
	changeNickname: (groupID: number, memberID: string, nickname: string) => void
	createGroup: (name: string, description: string) => void
	sendMessage: (args: { content: string }) => void
	loadMessageHistory: (groupID: number, before: string) => void
	removeRecommendation: (groupID: number) => void
	handleJoinRequest: (groupID: number, uid: string, accepted: boolean) => void
	promoteDemoteMember: (groupID: number, targetUID: string, newRole: string) => Promise<void>
	kickMember: (groupID: number, targetUID: string) => Promise<void>
}

const initialState: SocialState = {
	recommendations: [],
	groups: [],
	selectedGroup: null,
	messages: new Map(),
	members: new Map(),
}

const socialReducer = (state: SocialState, action: any): SocialState => {
	switch (action.type) {
		case 'SET_GROUPS':
			return { ...state, groups: action.payload }
		case 'SELECT_GROUP':
			return { ...state, selectedGroup: action.payload }
		case 'SET_RECOMMENDATIONS':
			return { ...state, recommendations: action.payload }
		case 'REMOVE_RECOMMENDATION': {
			const { groupID } = action.payload
			const updatedRecommendations = state.recommendations.filter(
				recommendation => recommendation.id != groupID,
			)
			return { ...state, recommendations: updatedRecommendations, selectedGroup: null }
		}
		case 'SET_MEMBERS':
			return { ...state, members: action.payload }
		case 'CREATE_GROUP': {
			const { user } = useAuth()
			if (!user) return state

			const groupID = action.payload.id
			const newMembers = new Map(state.members)
			newMembers.set(groupID, new Map())

			const member: GroupMember = {
				id: user?.uid,
				role: 'admin',
				nickname: null,
				displayName: user?.displayName || 'Unknown',
			}

			newMembers.get(groupID)?.set(user?.uid, member)
			return { ...state, groups: [action.payload, ...state.groups], members: newMembers }
		}
		case 'JOINED_GROUP_SUCCESS': {
			const group = action.payload

			const newMembers = new Map(state.members)
			const memberMap = new Map<string, GroupMember>()
			group.groupMembers.forEach((m: any) => {
				memberMap.set(m.id, {
					id: m.id,
					displayName: m.displayName,
					role: m.groupRole,
					nickname: m.nickname,
				})
			})
			newMembers.set(group.id, memberMap)

			const newGroup: GroupData = {
				id: group.id,
				name: group.name,
				theme: group.theme,
				description: group.description,
				memberCount: group.groupMembers.length,
				joinRequests: group.joinRequests,
			}

			const updatedGroups = [newGroup, ...state.groups.filter(g => g.id !== group.id)]

			return {
				...state,
				groups: updatedGroups,
				members: newMembers,
			}
		}

		case 'ADD_MESSAGE': {
			const message = action.payload

			if (message.type === 'SYSTEM') {
				switch (message.systemEvent) {
					case 'THEME_CHANGED': {
						const updatedGroups = state.groups.map(group => {
							if (group.id === message.groupID) {
								return {
									...group,
									theme: message.meta?.themeName || group.theme,
								}
							}
							return group
						})

						const groupID = message.groupID
						const newMessagesMap = new Map(state.messages)
						const existingMessages = newMessagesMap.get(groupID) || []
						newMessagesMap.set(groupID, [...existingMessages, message])

						const groupIndex = updatedGroups.findIndex(group => group.id === groupID)
						if (groupIndex !== -1) {
							const reorderedGroups = [...updatedGroups]
							const updatedGroup = { ...reorderedGroups[groupIndex], lastMessage: message }
							reorderedGroups.splice(groupIndex, 1)
							reorderedGroups.unshift(updatedGroup)
							return { ...state, groups: reorderedGroups, messages: newMessagesMap }
						}

						return { ...state, groups: updatedGroups, messages: newMessagesMap }
					}

					case 'NICKNAME_CHANGED': {
						const { uid, nickname } = message.meta || {}
						if (!uid || !nickname) return state

						const groupID = message.groupID
						const newMembersMap = new Map(state.members)
						const groupMembers = new Map(newMembersMap.get(groupID) || [])

						const member = groupMembers.get(uid)
						if (member) {
							groupMembers.set(uid, {
								...member,
								nickname: nickname,
							})
							newMembersMap.set(groupID, groupMembers)
						}

						const newMessagesMap = new Map(state.messages)
						const existingMessages = newMessagesMap.get(groupID) || []
						newMessagesMap.set(groupID, [...existingMessages, message])

						return {
							...state,
							members: newMembersMap,
							messages: newMessagesMap,
						}
					}

					case 'JOIN_REQUEST': {
						const { uid, displayName } = message.meta || {}
						if (!uid || !displayName) return state
						const groupID = message.groupID

						const newRequest: JoinRequest = {
							id: uid,
							displayName,
						}

						const updatedGroups = state.groups.map(group => {
							if (group.id === groupID) {
								return {
									...group,
									joinRequests: [...group.joinRequests, newRequest],
								}
							}
							return group
						})

						const updatedMessages = new Map(state.messages)
						const existingMessages = updatedMessages.get(groupID) || []
						updatedMessages.set(groupID, [...existingMessages, message])

						return {
							...state,
							groups: updatedGroups,
							messages: updatedMessages,
						}
					}

					case 'USER_JOINED': {
						const { uid, displayName, role } = message.meta || {}
						if (!uid || !displayName || !role) return state

						const newMember: GroupMember = {
							id: uid,
							displayName,
							nickname: null,
							role,
						}

						const updatedMembers = new Map(state.members)
						const groupMembers = new Map(updatedMembers.get(message.groupID) || new Map())
						groupMembers.set(uid, newMember)
						updatedMembers.set(message.groupID, groupMembers)

						const groupID = message.groupID
						const updatedMessages = new Map(state.messages)
						const groupMsgs = updatedMessages.get(groupID) || []
						updatedMessages.set(groupID, [...groupMsgs, message])

						const updatedGroups = state.groups.map(group => {
							if (groupID === group.id) {
								return {
									...group,
									memberCount: (group.memberCount || 0) + 1,
								}
							}
							return group
						})

						return {
							...state,
							members: updatedMembers,
							messages: updatedMessages,
							groups: updatedGroups,
						}
					}

					case 'USER_KICKED': {
						const { uid } = message.meta || {}
						const groupID = message.groupID

						const newMembersMap = new Map(state.members)
						const groupMembers = new Map(newMembersMap.get(groupID))
						groupMembers.delete(uid)
						newMembersMap.set(groupID, groupMembers)

						const newMessagesMap = new Map(state.messages)
						const existingMessages = newMessagesMap.get(groupID) || []
						newMessagesMap.set(groupID, [...existingMessages, message])

						const newGroups = state.groups.map(group => {
							if (group.id === groupID) {
								return {
									...group,
									memberCount: (group.memberCount || 1) - 1,
								}
							}
							return group
						})

						return {
							...state,
							members: newMembersMap,
							messages: newMessagesMap,
							groups: newGroups,
						}
					}

					case 'ROLE_CHANGED': {
						const { uid, newRole } = message.meta || {}
						const groupID = message.groupID

						const updatedMembers = new Map(state.members)
						const groupMembers = new Map(updatedMembers.get(groupID))
						const member = groupMembers.get(uid)
						if (member) {
							groupMembers.set(uid, { ...member, role: newRole })
							updatedMembers.set(groupID, groupMembers)
						}

						const updatedMessages = new Map(state.messages)
						const existingMessages = updatedMessages.get(groupID) || []
						updatedMessages.set(groupID, [...existingMessages, message])

						return {
							...state,
							members: updatedMembers,
							messages: updatedMessages,
						}
					}

					default: {
						console.log('implement this: ' + message.systemEvent)
					}
				}
			}

			const groupID = message.groupID
			const newMessagesMap = new Map(state.messages)
			const existingMessages = newMessagesMap.get(groupID) || []
			newMessagesMap.set(groupID, [...existingMessages, message])

			const groupIndex = state.groups.findIndex(group => group.id === groupID)
			if (groupIndex !== -1) {
				const updatedGroups = [...state.groups]
				const updatedGroup = { ...updatedGroups[groupIndex], lastMessage: message }
				updatedGroups.splice(groupIndex, 1)
				updatedGroups.unshift(updatedGroup)
				return { ...state, groups: updatedGroups, messages: newMessagesMap }
			}
			return { ...state, messages: newMessagesMap }
		}
		case 'PREPEND_MESSAGES': {
			const { groupID, messages } = action.payload
			const newMessagesMap = new Map(state.messages)
			const existingMessages = newMessagesMap.get(groupID) || []
			newMessagesMap.set(groupID, [...messages, ...existingMessages])
			return { ...state, messages: newMessagesMap }
		}
		case 'LEAVE_GROUP': {
			const groupID = action.payload
			const updatedGroups = state.groups.filter(group => group.id !== groupID)
			const newMessagesMap = new Map(state.messages)
			newMessagesMap.delete(groupID)
			return {
				...state,
				groups: updatedGroups,
				selectedGroup: null,
				messages: newMessagesMap,
			}
		}
		case 'HANDLED_JOIN_REQUEST': {
			const { groupID, uid } = action.payload

			const updatedGroups = state.groups.map(group => {
				if (group.id !== groupID) return group

				return {
					...group,
					joinRequests: group.joinRequests.filter(request => request.id !== uid),
				}
			})

			return {
				...state,
				groups: updatedGroups,
			}
		}

		default:
			return state
	}
}

const SocialContext = createContext<SocialContextType | null>(null)

export const SocialProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(socialReducer, initialState)
	const websocket = useRef<WebSocket | null>(null)

	const enrichMessageWithSenderName = (message: Message): Message => {
		const groupMembers = state.members.get(message.groupID)
		const member = groupMembers?.get(message.senderID)
		return {
			...message,
			senderName: message.type === 'TEXT' ? member?.displayName || 'Unknown User' : '',
		}
	}

	const fetchGroupData = async () => {
		try {
			const token = await auth.currentUser?.getIdToken(true)
			const response = await axios.get(`http://${BACKEND_URL}/social/groups`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			const groupData: GroupData[] = []
			const membersByGroup = new Map<number, Map<string, GroupMember>>()
			response.data.forEach((group: any) => {
				const memberMap = new Map<string, GroupMember>()
				group.groupMembers.forEach((m: any) =>
					memberMap.set(m.id, {
						id: m.id,
						displayName: m.displayName,
						role: m.groupRole,
						nickname: m.nickname,
					}),
				)
				membersByGroup.set(group.id, memberMap)
				groupData.push({
					id: group.id,
					name: group.name,
					theme: group.theme,
					description: group.description,
					memberCount: group.groupMembers.length,
					joinRequests: group.joinRequests,
				})
			})
			dispatch({ type: 'SET_MEMBERS', payload: membersByGroup })
			dispatch({ type: 'SET_GROUPS', payload: groupData })
		} catch (err) {
			console.error('Error fetching groups:', err)
		}
	}

	const fetchRecommendations = async () => {
		try {
			const currentUser = auth.currentUser
			const token = await currentUser?.getIdToken(true)

			const response = await axios.get(`http://${BACKEND_URL}/social/recommended-groups`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			dispatch({ type: 'SET_RECOMMENDATIONS', payload: response.data })
		} catch (err) {
			console.error('Error fetching recommendations: ' + err)
		}
	}

	const loadMessageHistory = async (groupID: number, before: string) => {
		try {
			const token = await auth.currentUser?.getIdToken(true)
			const response = await axios.get(
				`http://${BACKEND_URL}/social/group/${groupID}/messages`,
				{
					params: { before },
					headers: { Authorization: `Bearer ${token}` },
				},
			)
			const messages: Message[] = response.data.map(enrichMessageWithSenderName)
			dispatch({ type: 'PREPEND_MESSAGES', payload: { groupID, messages } })
		} catch (err) {
			console.error('Error loading messages:', err)
		}
	}

	const connectWebSocket = async () => {
		try {
			if (websocket.current) return
			const token = await auth.currentUser?.getIdToken(true)
			const ws = new WebSocket(`ws://${BACKEND_URL}/social/chat`, [token || ''])
			websocket.current = ws

			ws.onmessage = async e => {
				try {
					const raw: Message = JSON.parse(e.data)

					if (raw.type === 'SYSTEM' && raw.systemEvent === 'JOINED_GROUP') {
						const groupID = raw.meta?.groupID
						if (!groupID) return

						try {
							const token = await auth.currentUser?.getIdToken(true)
							const response = await axios.get(
								`http://${BACKEND_URL}/social/groups/${groupID}`,
								{
									headers: { Authorization: `Bearer ${token}` },
								},
							)

							const group = response.data

							dispatch({ type: 'JOINED_GROUP_SUCCESS', payload: group })

							toast.success(`You were added to "${group.name}"`)
						} catch (err) {
							console.error('Error fetching joined group data:', err)
						}

						return
					}

					dispatch({ type: 'ADD_MESSAGE', payload: enrichMessageWithSenderName(raw) })
				} catch (err) {
					console.error('WebSocket parse error:', err)
				}
			}

			ws.onopen = () => console.log('WS connected')
			ws.onclose = () => (websocket.current = null)
			ws.onerror = err => console.error('WS error:', err)
		} catch (err) {
			console.error('Error connecting WebSocket:', err)
		}
	}

	return (
		<SocialContext.Provider
			value={{
				state,
				connectSocial: async () => {
					await Promise.all([fetchGroupData(), fetchRecommendations()])
					await connectWebSocket()
				},
				selectGroup: g => dispatch({ type: 'SELECT_GROUP', payload: g }),
				joinGroup: async id => {
					const token = await auth.currentUser?.getIdToken()
					const response = await axios.post(
						`http://${BACKEND_URL}/social/join-request/${id}`,
						{},
						{
							headers: { Authorization: `Bearer ${token}` },
						},
					)
					return response.status === 201
				},
				leaveGroup: async id => {
					const token = await auth.currentUser?.getIdToken(true)
					await axios.delete(`http://${BACKEND_URL}/social/group/${id}`, {
						headers: { Authorization: `Bearer ${token}` },
					})
					dispatch({ type: 'LEAVE_GROUP', payload: id })
				},
				changeTheme: async (groupID, theme) => {
					const token = await auth.currentUser?.getIdToken()
					await axios.put(
						`http://${BACKEND_URL}/social/group/${groupID}/theme/${theme}`,
						{},
						{
							headers: { Authorization: `Bearer ${token}` },
						},
					)
				},
				changeNickname: async (groupID, memberID, nickname) => {
					if (!state.selectedGroup) return
					if (state.members.get(state.selectedGroup.id)?.get(memberID)?.nickname == nickname)
						return
					const token = await auth.currentUser?.getIdToken()
					await axios.put(
						`http://${BACKEND_URL}/social/group/nickname`,
						{
							uid: memberID,
							groupId: groupID,
							nickname: nickname,
						},
						{
							headers: { Authorization: `Bearer ${token}` },
						},
					)
				},
				createGroup: async (name, desc) => {
					if (!name.trim()) return
					const token = await auth.currentUser?.getIdToken(true)
					const res = await axios.post(
						`http://${BACKEND_URL}/social/group`,
						{ name, description: desc },
						{
							headers: { Authorization: `Bearer ${token}` },
						},
					)
					dispatch({
						type: 'CREATE_GROUP',
						payload: {
							id: res.data.id,
							name,
							description: desc,
							memberCount: 1,
							joinRequests: [],
						},
					})
				},
				sendMessage: ({ content }: { content: string }) => {
					const g = state.selectedGroup
					if (!g || !websocket.current) return
					if (!content.trim()) return
					websocket.current.send(
						JSON.stringify({
							groupID: g.id,
							content,
							type: 'TEXT',
						}),
					)
				},
				loadMessageHistory,
				removeRecommendation: (groupID: number) => {
					dispatch({ type: 'REMOVE_RECOMMENDATION', payload: { groupID } })
				},
				handleJoinRequest: async (groupID: number, uid: string, accept: boolean) => {
					try {
						const token = await auth.currentUser?.getIdToken()
						await axios.put(
							`http://${BACKEND_URL}/social/join-requests/handle`,
							{
								groupId: groupID,
								id: uid,
								accepted: accept,
							},
							{
								headers: {
									Authorization: `Bearer ${token}`,
								},
							},
						)
						dispatch({ type: 'HANDLED_JOIN_REQUEST', payload: { groupID, uid } })
					} catch (err) {
						console.error('Error handling join request: ' + err)
					}
				},
				promoteDemoteMember: async (groupID, targetUID, newRole) => {
					const token = await auth.currentUser?.getIdToken()
					await axios.put(
						`http://${BACKEND_URL}/social/group/${groupID}/members/${targetUID}/role`,
						{ newRole },
						{ headers: { Authorization: `Bearer ${token}` } },
					)
				},

				kickMember: async (groupID, targetUID) => {
					const token = await auth.currentUser?.getIdToken()
					await axios.delete(
						`http://${BACKEND_URL}/social/group/${groupID}/members/${targetUID}`,
						{ headers: { Authorization: `Bearer ${token}` } },
					)
				},
			}}
		>
			{children}
		</SocialContext.Provider>
	)
}

export const useSocial = () => {
	const ctx = useContext(SocialContext)
	if (!ctx) throw new Error('useSocial must be used in provider')
	return ctx
}
