import { createContext, useContext, FC, ReactNode, useReducer, useRef } from 'react'
import { auth } from '../firebase/firebase'
import { BACKEND_URL } from '../../integration-config'
import axios from 'axios'

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
}

export interface JoinRequest {
	id: string
	displayName: string
	motivation: string
}

export type SystemEventType =
	| 'JOIN_REQUESTED'
	| 'USER_JOINED'
	| 'USER_LEFT'
	| 'USER_KICKED'
	| 'ROLE_CHANGED'
	| 'GROUP_CREATED'
	| 'THEME_CHANGED'
	| 'NICKNAME_CHANGED'

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
	joinGroup: (groupID: number) => void
	leaveGroup: (groupID: number) => void
	createGroup: (name: string, description: string) => void
	sendMessage: (content: string) => void
	loadMessageHistory: (groupID: number, before: string) => void
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
		case 'SET_MEMBERS':
			return { ...state, members: action.payload }
		case 'CREATE_GROUP':
			return { ...state, groups: [action.payload, ...state.groups] }
		case 'ADD_MESSAGE': {
			const message = action.payload
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
					memberMap.set(m.id, { id: m.id, displayName: m.displayName, role: m.groupRole }),
				)
				membersByGroup.set(group.id, memberMap)
				groupData.push({
					id: group.id,
					name: group.name,
					description: group.description,
					memberCount: group.groupMembers.length,
					joinRequests: [],
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

			ws.onmessage = e => {
				try {
					const raw: Message = JSON.parse(e.data)
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
					await axios.post(
						`http://${BACKEND_URL}/social/join-request/${id}`,
						{},
						{
							headers: { Authorization: `Bearer ${token}` },
						},
					)
				},
				leaveGroup: async id => {
					const token = await auth.currentUser?.getIdToken(true)
					await axios.delete(`http://${BACKEND_URL}/social/group/${id}`, {
						headers: { Authorization: `Bearer ${token}` },
					})
					dispatch({ type: 'LEAVE_GROUP', payload: id })
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
				sendMessage: content => {
					const g = state.selectedGroup
					if (!g || !content.trim() || !websocket.current) return
					websocket.current.send(JSON.stringify({ groupID: g.id, content }))
				},
				loadMessageHistory,
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
