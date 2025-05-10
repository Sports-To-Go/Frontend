import { FC, useEffect, useRef, useState } from 'react'
import ChatHeader from '../ChatHeader/ChatHeader'
import ChatMessages from '../ChatMessages/ChatMessages'
import ChatMessageBar from '../ChatMessageBar/ChatMessageBar'
import GroupSettings from '../GroupSettings/GroupSettings'
import { BACKEND_URL } from '../../../integration-config'
import { auth } from '../../firebase/firebase'
import { useAuth } from '../../context/UserContext'
import axios from 'axios'
import './GroupChat.scss'

interface GroupProps {
	groupID: number
	onBack: () => void
	onLeave: () => void
}

interface Message {
	id: number
	senderName: string
	senderID: string
	content: string
	timestamp: string
}

interface GroupMember {
	displayName: string
	id: string
	role: string
}

interface JoinRequest {
	id: string
	displayName: string
	motivation: string
}

const GroupChat: FC<GroupProps> = ({ groupID, onBack, onLeave }) => {
	const { user } = useAuth()

	const [groupName, setGroupName] = useState<string>('Loading...')
	const [groupMembers, setGroupMembers] = useState<Map<string, GroupMember>>(new Map())
	const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])

	const [messages, setMessages] = useState<Message[]>([])
	const [newMessage, setNewMessage] = useState('')
	const [isGroupSettingsOpen, setIsGroupSettingsOpen] = useState(false)
	const ws = useRef<WebSocket | null>(null)
	const [themeGradient, setThemeGradient] = useState<string>(
		'linear-gradient(to right, #ffffff, #ffffff)',
	)

	const fetchGroupData = async (groupID: number) => {
		try {
			const currentUser = auth.currentUser
			const token = await currentUser?.getIdToken(true)

			const response = await axios.get(`http://${BACKEND_URL}/social/group/${groupID}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			console.log(response.data)

			setGroupName(response.data.name)
			setGroupMembers(response.data.groupMembers)
			setGroupMembers(
				new Map(response.data.groupMembers.map((member: GroupMember) => [member.id, member])),
			)
			setJoinRequests(response.data.joinRequests || [])
		} catch (error) {
			console.log('Error fetching group data: ' + error)
		}
	}

    const handleJoinRequest = async (id: string, accept: boolean) => {
        try {
            const currentUser = auth.currentUser
            const token = await currentUser?.getIdToken(true)
    
            const response = await axios.post(`http://${BACKEND_URL}/social/join-requests/handle`, {
                groupId: groupID,
                id: id,
                accepted: accept
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
    
            // If request is successful, remove the join request from frontend
            if (response.status === 200) {
                if (accept) {
                    setGroupMembers((prevMembers) => {
                      const newMembers = new Map(prevMembers);
                      newMembers.set(response.data.id, response.data);
                      return newMembers;
                    });
                  }

                setJoinRequests(prevRequests => prevRequests.filter(req => req.id !== id))
                console.log(`Join request ${accept ? 'accepted' : 'declined'} for user ${id}`)
            }
        } catch (error) {
            console.error(`Error handling join request:`, error)
        }
    }

	useEffect(() => {
		let reconnectAttempts = 0
		let isComponentMounted = true
		let hasFetchedData = false

		const connectWebSocket = async () => {
			if (ws.current) {
				ws.current.close()
				ws.current = null
			}

			try {
				const currentUser = auth?.currentUser
				const token = await currentUser?.getIdToken(true)

				if (!isComponentMounted) return

				ws.current = new WebSocket(`ws://${BACKEND_URL}/social/chat/${groupID}`, [token || ''])

				ws.current.onopen = () => {
					console.log('WebSocket connection established')
					setMessages([])
					reconnectAttempts = 0
					if (!hasFetchedData) {
						fetchGroupData(groupID)
						hasFetchedData = true
					}
				}

				ws.current.onmessage = e => {
					try {
						const incomingMessage: Message = JSON.parse(e.data)

						const senderName =
							groupMembers.get(incomingMessage.senderID)?.displayName || 'Unknown'

						const messageWithSenderName = {
							...incomingMessage,
							senderName,
						}

						setMessages(prev => [...prev, messageWithSenderName])
					} catch (error) {
						console.error('Failed to parse WebSocket message:', error)
					}
				}

				ws.current.onclose = () => {
					console.log('WebSocket connection closed')
					if (reconnectAttempts < 5) {
						reconnectAttempts++
						setTimeout(connectWebSocket, 2000)
					}
				}

				ws.current.onerror = e => {
					console.error('WebSocket error: ', e)
				}
			} catch (err) {
				console.error('Failed to fetch token for WebSocket:', err)
			}
		}

		connectWebSocket()

		return () => {
			isComponentMounted = false
			if (ws.current) {
				console.log('Closing WebSocket connection on unmount')
				ws.current.close()
				ws.current = null
			}
		}
	}, [groupID])

	const sendMessage = () => {
		if (newMessage.trim() && ws.current?.readyState == WebSocket.OPEN) {
			const outgoingMessage: any = {
				id: messages.length + 1,
				senderID: user?.uid || '',
				content: newMessage,
				timestamp: new Date().toISOString(),
			}
			ws.current.send(JSON.stringify(outgoingMessage))
			setNewMessage('')
		}
	}

	return (
		<div
			className="chat-container"
			style={{
				background: themeGradient,
				backgroundSize: themeGradient.includes('url(') ? 'cover' : 'initial',
				backgroundPosition: themeGradient.includes('url(') ? 'center' : 'initial',
			}}
		>
			<ChatHeader
				groupName={groupName}
				status="online"
				onBack={onBack}
				onOpenSettings={() => setIsGroupSettingsOpen(true)}
			/>
			<ChatMessages messages={messages} />
			<ChatMessageBar
				newMessage={newMessage}
				onMessageChange={setNewMessage}
				onSendMessage={sendMessage}
			/>
			{isGroupSettingsOpen && (
				<GroupSettings
					groupMembers={[...groupMembers.values()]}
					joinRequests={joinRequests}
                    handleJoinRequest={handleJoinRequest}
					onClose={() => setIsGroupSettingsOpen(false)}
					onThemeChange={setThemeGradient}
					onLeave={onLeave}
				/>
			)}
		</div>
	)
}

export default GroupChat
