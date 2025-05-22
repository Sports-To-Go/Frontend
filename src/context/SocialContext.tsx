import { createContext, useContext, FC, ReactNode, useReducer, useRef } from 'react'
import { useAuth } from './UserContext'
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

export interface Message {
	id: number
	senderID: string
	groupID: number
	content: string
	timestamp: string
	// type: string
}

export interface GroupData extends GroupPreview {
	lastMessage?: Message
	joinRequests: JoinRequest[]
	// To be added
	// theme?: string
	// nicknames?: Map<string, string>
}

interface SocialState {
	recommendations: GroupPreview[]
	groups: GroupData[]
	selectedGroup: GroupPreview | null
	messages: Map<number, Message[]> // groupID -> messages
	members: Map<string, GroupMember> // userID -> groupMember
}

interface SocialContextType {
	state: SocialState
	connectSocial: () => {}
	selectGroup: (group: GroupPreview | null) => void
	joinGroup: (groupID: number) => {}
	leaveGroup: (groupID: number) => {}
	createGroup: (name: string, description: string) => {}
    sendMessage: (content: string) => void
}

type SocialAction =
	| { type: 'SET_GROUPS'; payload: GroupData[] }
	| { type: 'SET_RECOMMENDATIONS'; payload: GroupPreview[] }
	| { type: 'SELECT_GROUP'; payload: GroupPreview | null }
	| { type: 'LEAVE_GROUP'; payload: number }
	| { type: 'CREATE_GROUP'; payload: GroupData }
	| { type: 'ADD_MESSAGE'; payload: Message }
	| { type: 'SET_MEMBERS'; payload: Map<string, GroupMember> }

const initialState: SocialState = {
	recommendations: [],
	groups: [],
	selectedGroup: null,
	messages: new Map(),
	members: new Map(),
}

const socialReducer = (state: SocialState, action: SocialAction): SocialState => {
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

			// Update messages map
			const newMessagesMap = new Map(state.messages)
			const existingMessages = newMessagesMap.get(groupID) || []
			newMessagesMap.set(groupID, [...existingMessages, message])

			// Update groups array - set lastMessage and move to front
			const groupIndex = state.groups.findIndex(group => group.id === groupID)
			if (groupIndex !== -1) {
				const updatedGroups = [...state.groups]
				const updatedGroup = { ...updatedGroups[groupIndex], lastMessage: message }
				
				// Remove from current position and add to front
				updatedGroups.splice(groupIndex, 1)
				updatedGroups.unshift(updatedGroup)

				return {
					...state,
					groups: updatedGroups,
					messages: newMessagesMap,
				}
			}

			return {
				...state,
				messages: newMessagesMap,
			}
		}

		case 'LEAVE_GROUP': {
			const groupID = action.payload
			const updatedMyGroups = state.groups.filter(group => group.id !== groupID)

			// Clean up messages for this group
			const newMessagesMap = new Map(state.messages)
			newMessagesMap.delete(groupID)

			return {
				...state,
				groups: updatedMyGroups,
				selectedGroup: null,
				messages: newMessagesMap,
			}
		}

		default:
			return state
	}
}

const SocialContext = createContext<SocialContextType | null>(null)

interface SocialProviderProps {
	children: ReactNode
}

export const SocialProvider: FC<SocialProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(socialReducer, initialState)
	const { user } = useAuth()
	const websocket = useRef<WebSocket | null>(null)

	const fetchGroupData = async () => {
		try {
			const currentUser = auth.currentUser
			const token = await currentUser?.getIdToken(true)

			const response = await axios.get(`http://${BACKEND_URL}/social/groups`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			const groupData: GroupData[] = []
			const membersMap = new Map<string, GroupMember>()

			response.data.map((e: any) => {
				// Add all group members to the members map
				e.groupMembers.map((member: any) => {
					membersMap.set(member.id, member)
				})

				const group: GroupData = {
					id: e.id,
					joinRequests: [],
					name: e.name,
					description: e.description,
					memberCount: e.groupMembers.length,
				}

				groupData.push(group)
			})

			// Update members map in state
			dispatch({ type: 'SET_MEMBERS', payload: membersMap })
			dispatch({ type: 'SET_GROUPS', payload: groupData })
		} catch (err) {
			console.error('Error fetching groups: ' + err)
		}
	}

	const selectGroup = (group: GroupPreview | null) => {
		dispatch({ type: 'SELECT_GROUP', payload: group })
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

	const joinGroup = async (groupID: number) => {
		try {
			const currentUser = auth.currentUser
			const token = await currentUser?.getIdToken()

			await axios.post(
				`http://${BACKEND_URL}/social/join-request/${groupID}`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			)
		} catch (err) {
			console.error('Error requesting to join group:', err)
		}
	}

	const leaveGroup = async (groupID: number) => {
		try {
			const currentUser = auth.currentUser
			const token = await currentUser?.getIdToken(true)

			await axios.delete(`http://${BACKEND_URL}/social/group/${groupID}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			// Update state
			dispatch({ type: 'LEAVE_GROUP', payload: groupID })
		} catch (error) {
			console.error('Error leaving group:', error)
		}
	}

	const createGroup = async (name: string, description: string) => {
		if (!name.trim()) return

		try {
			const currentUser = auth.currentUser
			const token = await currentUser?.getIdToken(true)

			const response = await axios.post(
				`http://${BACKEND_URL}/social/group`,
				{ name, description },
				{ headers: { Authorization: `Bearer ${token}` } },
			)

			const newGroup: GroupData = {
				id: response.data.id,
				name: name,
				description: description,
				memberCount: 1,
				joinRequests: [],
			}

			dispatch({ type: 'CREATE_GROUP', payload: newGroup })
		} catch (err) {
			console.error('Error creating group: ' + err)
		}
	}

	const connectWebSocket = async () => {
		try {
			const currentUser = auth.currentUser
			const token = await currentUser?.getIdToken(true)

			const ws = new WebSocket(`ws://${BACKEND_URL}/social/chat`, [token || ''])
			websocket.current = ws

			ws.onopen = () => {
				console.log('WebSocket connection established')
			}

			ws.onmessage = (event) => {
				try {
					const message: Message = JSON.parse(event.data)
					console.log('Received message:', message)
					dispatch({ type: 'ADD_MESSAGE', payload: message })
				} catch (error) {
					console.error('Error parsing incoming message:', error)
				}
			}

			ws.onclose = () => {
				console.log('WebSocket connection closed')
				websocket.current = null
			}

			ws.onerror = (error) => {
				console.error('WebSocket connection error:', error)
			}
		} catch (err) {
			console.error('Error connecting web socket:', err)
		}
	}

	const connectSocial = async () => {
		await Promise.all([fetchGroupData(), fetchRecommendations()])
		await connectWebSocket()
	}

	const sendMessage = (content: string) => {
		const { selectedGroup } = state
		if (!selectedGroup || !content.trim()) {
			console.error('Cannot send message: no group selected or empty content')
			return
		}

		if (websocket.current?.readyState === WebSocket.OPEN) {
			const outgoingMessage = {
				groupID: selectedGroup.id,
				content: content.trim(),
			}

			try {
				websocket.current.send(JSON.stringify(outgoingMessage))
			} catch (error) {
				console.error('Error sending message:', error)
			}
		} else {
			console.error('WebSocket is not connected')
		}
	}

	const contextValue: SocialContextType = {
		state,
		connectSocial: connectSocial,
		selectGroup: selectGroup,
		joinGroup: joinGroup,
		leaveGroup: leaveGroup,
		createGroup: createGroup,
        sendMessage: sendMessage,
	}

	return <SocialContext.Provider value={contextValue}>{children}</SocialContext.Provider>
}

export const useSocial = (): SocialContextType => {
	const context = useContext(SocialContext)

	if (context === null) {
		throw new Error('useSocial must be used within a SocialProvider')
	}

	return context
}