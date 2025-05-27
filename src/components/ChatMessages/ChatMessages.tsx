import { FC, useEffect, useRef } from 'react'
import RoundedPhoto from '../RoundedPhoto/RoundedPhoto'
import './ChatMessages.scss'
import Spinner from '../Spinner/Spinner'

interface Message {
	id: number
	senderName: string
	content: string
	timestamp: string
	type: 'TEXT' | 'SYSTEM'
}

interface ChatMessagesProps {
	messages: Message[]
	onTopReached?: () => void
	loadingTop?: boolean
}

const ChatMessages: FC<ChatMessagesProps> = ({ messages, onTopReached, loadingTop }) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	// Scroll listener to detect when we hit the top
	useEffect(() => {
		const container = containerRef.current
		if (!container || !onTopReached) return

		let lastCalled = 0

		const handleScroll = () => {
			if (container.scrollTop < 100) {
				const now = Date.now()
				if (now - lastCalled > 1000) {
					// debounce
					console.log('Reached for top')
					onTopReached()
					lastCalled = now
				}
			}
		}

		container.addEventListener('scroll', handleScroll)
		return () => container.removeEventListener('scroll', handleScroll)
	}, [onTopReached])

	return (
		<div className="chat-messages" ref={containerRef}>
			{loadingTop && <Spinner size={24} />}

			{messages.map(msg => {
				if (msg.type === 'SYSTEM') {
					return (
						<div key={msg.id} className="system-message">
							<span>{msg.content}</span>
						</div>
					)
				}

				return (
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
				)
			})}

			<div ref={messagesEndRef} />
		</div>
	)
}

export default ChatMessages
