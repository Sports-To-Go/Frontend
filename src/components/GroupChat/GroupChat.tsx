import { FC, useEffect, useState, useRef } from 'react'
import './GroupChat.scss'

import RoundedPhoto from '../RoundedPhoto/RoundedPhoto'
import { CiSettings } from 'react-icons/ci'
import { MdLink } from 'react-icons/md'
import { FiMessageCircle } from 'react-icons/fi'
import GroupSettingsModal from '../GroupSettings/GroupSettingsModal'

interface GroupProps {
	groupID: number
}

interface Message {
	id: number
	sender: string
	content: string
	timestamp: string
}

const GroupChat: FC<GroupProps> = ({ groupID }) => {
	const groupName = 'Example Group #' + groupID //const [groupName, setGroupName] = useState(`Mock Group #${groupID}`);
	const status = 'online' //const [status, setStatus] = useState('online');
	const [messages, setMessages] = useState<Message[]>([])
	const [newMessage, setNewMessage] = useState('')
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const [isGroupSettingsOpen, setIsGroupSettingsOpen] = useState(false)
	const groupMembers = [
		'Goldan David',
		'Smau Robert',
		'Onofrei Radu',
		'Dascaliu Ianis',
		'Lionel Fortnite',
	]

	const ws = useRef<WebSocket | null>(null)
	const userID: string = useRef('user-' + Math.floor(Math.random() * 100000)).current // for purely testing

	// State for the chat background gradient or image
	const [themeGradient, setThemeGradient] = useState<string>('linear-gradient(to right, #ffffff, #ffffff)')

	// Scroll to bottom function
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		let reconnectAttempts = 0

		const connectWebSocket = () => {
			if (ws.current) return
			ws.current = new WebSocket('ws://localhost:8080') // to be replaced

			ws.current.onopen = () => {
				console.log('WebSocket connection established')
				reconnectAttempts = 0
			}

			ws.current.onmessage = e => {
				try {
					const incomingMessage: Message = JSON.parse(e.data)
					setMessages(prev => [...prev, incomingMessage])
					scrollToBottom()
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
		}

		connectWebSocket()

		return () => {
			ws.current?.close()
			ws.current = null
		}
	}, [groupID])

	const sendMessage = () => {
		if (newMessage.trim() && ws.current?.readyState == WebSocket.OPEN) {
			const outgoingMessage: Message = {
				id: messages.length + 1,
				sender: userID,
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
			<div className="chat-header">
				<div className="header-title">
					<RoundedPhoto size={40} imagePath={`https://i.pravatar.cc/40`} />
					<div className="title">
						<div>{groupName}</div>
						<div className={status === 'online' ? 'active' : 'offline'}>
							{status === 'online' ? 'active now' : 'offline'}
						</div>
					</div>
				</div>
				<CiSettings cursor="pointer" onClick={() => setIsGroupSettingsOpen(true)} />
			</div>
			<div className="chat-messages">
				{messages.map(msg => (
					<div key={msg.id} className="message-container">
						<RoundedPhoto size={40} />
						<div className="message-content">
							<div className="message-title">
								<strong className="message-sender">{msg.sender}</strong>
								<small className="message-timestamp">
									{new Date(msg.timestamp).toLocaleTimeString()}
								</small>
							</div>
							<div className="message">{msg.content}</div>
						</div>
					</div>
				))}
				{/* This is the invisible div we scroll to */}
				<div ref={messagesEndRef} />
			</div>
			<div className="chat-message-bar">
				<MdLink onClick={() => alert('links to be added')} cursor="pointer" />
				<div className="message-bar-container">
					<input
						type="text"
						className="message-input"
						placeholder="Aa"
						value={newMessage}
						onChange={e => setNewMessage(e.target.value)}
						onKeyDown={e => {
							if (e.key === 'Enter') sendMessage()
						}}
					/>
					<FiMessageCircle onClick={sendMessage} cursor="pointer" />
				</div>
			</div>

			{/* Group Settings Modal */}
			{isGroupSettingsOpen && (
				<GroupSettingsModal
					groupMembers={groupMembers}
					onClose={() => setIsGroupSettingsOpen(false)}
					onThemeChange={setThemeGradient} 
				/>
			)}
		</div>
	)
}

export default GroupChat