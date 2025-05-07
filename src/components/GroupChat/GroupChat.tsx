// /src/components/GroupChat/GroupChat.tsx

import { FC, useEffect, useRef, useState } from 'react'
import ChatHeader from '../ChatHeader/ChatHeader'
import ChatMessages from '../ChatMessages/ChatMessages'
import ChatMessageBar from '../ChatMessageBar/ChatMessageBar'
import GroupSettingsModal from '../GroupSettings/GroupSettingsModal'
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
    id: string
    displayName: string
}

const GroupChat: FC<GroupProps> = ({ groupID, onBack, onLeave }) => {
    const { user } = useAuth()

    const [groupName, setGroupName] = useState<string>('Loading...')
    const [groupMembers, setGroupMembers] = useState<Map<string, string>>(new Map())

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
			setGroupMembers(new Map(response.data.groupMembers.map((member: GroupMember) => [member.id, member.displayName])))
        } catch (error) {
            console.log('Error fetching group data: ' + error)
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

                        const senderName = groupMembers.get(incomingMessage.senderID) || 'Unknown'

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
                <GroupSettingsModal
                    groupMembers={[...groupMembers.values()]}
                    onClose={() => setIsGroupSettingsOpen(false)}
                    onThemeChange={setThemeGradient}
                    onLeave={onLeave}
                />
            )}
        </div>
    )
}

export default GroupChat
