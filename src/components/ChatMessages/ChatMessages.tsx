import { FC, useEffect, useRef } from 'react'
import RoundedPhoto from '../RoundedPhoto/RoundedPhoto'
import './ChatMessages.scss'

interface Message {
	id: number
	senderName: string
	content: string
	timestamp: string
}

interface ChatMessagesProps {
	messages: Message[]
}

const ChatMessages: FC<ChatMessagesProps> = ({ messages }) => {
	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	return (
		<div className="chat-messages">
			{messages.map(msg => (
				<div key={msg.id} className="message-container">
					<RoundedPhoto size={40} />
					<div className="message-content">
						<div className="message-title">
							<strong className="message-sender">{msg.senderName}</strong>
							<small className="message-timestamp">
								{new Date(msg.timestamp).toLocaleTimeString()}
							</small>
						</div>
						<div className="message">{msg.content}</div>
					</div>
				</div>
			))}
			<div ref={messagesEndRef} />
		</div>
	)
}

export default ChatMessages
