import { FC, useEffect, useState, useRef } from 'react'
import axios from 'axios'
import './GroupChat.scss'

import RoundedPhoto from '../RoundedPhoto/RoundedPhoto'
import { CiSettings } from 'react-icons/ci'
import { MdLink } from 'react-icons/md'
import { FiMessageCircle } from 'react-icons/fi'

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

	// Scroll to bottom function
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		// Fetch 50-80 random messages
		const fetchMessages = async () => {
			try {
				const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const randomMessages = response.data.slice(0, 100).map((post: any, index: number) => ({
					id: post.id,
					sender: `User ${index + 1}`,
					content: post.body,
					timestamp: new Date().toISOString(),
				}))
				setMessages(randomMessages)
			} catch (error) {
				console.error('Error fetching mock messages:', error)
			}
		}

		fetchMessages()
	}, [groupID])

	useEffect(() => {
		// Scroll to bottom whenever messages change
		scrollToBottom()
	}, [messages])

	const sendMessage = () => {
		if (newMessage.trim()) {
			const newMsg: Message = {
				id: messages.length + 1,
				sender: 'You',
				content: newMessage,
				timestamp: new Date().toISOString(),
			}
			setMessages(prev => [...prev, newMsg])
			setNewMessage('')
		}
	}

	return (
		<div className="chat-container">
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
				<CiSettings cursor="pointer" onClick={() => alert('chat settings to be implemented')} />
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
		</div>
	)
}

export default GroupChat
