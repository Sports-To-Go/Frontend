import { FC, useEffect, useRef } from 'react'
import RoundedPhoto from '../RoundedPhoto/RoundedPhoto'
import './ChatMessages.scss'
import Spinner from '../Spinner/Spinner'
import { Message } from '../../context/SocialContext'

interface ChatMessagesProps {
	messages: (Message & { senderName?: string })[]
	onTopReached?: () => void
	loadingTop?: boolean
	groupID: number
}

function formatSystemMessage(msg: Message): string {
	const meta = msg.meta || {}
	switch (msg.systemEvent) {
		case 'USER_JOINED':
			return `${meta.displayName} joined the group.`
		case 'USER_LEFT':
			return `${meta.displayName} left the group.`
		case 'USER_KICKED':
			return `${meta.kickedName} was kicked by ${meta.byName}.`
		case 'ROLE_CHANGED':
			return `${meta.displayName} is now ${meta.newRole}.`
		case 'THEME_CHANGED':
			return `Theme changed to ${meta.themeName}.`
		case 'NICKNAME_CHANGED': {
			const { changedByName, uid, oldNickanme, newNickname } = meta

			return `${changedByName} set nickname for ${oldNickanme} to "${newNickname}".`
		}
		case 'JOIN_REQUESTED':
			return `${meta.displayName} requested to join: "${meta.motivation}"`
		case 'GROUP_CREATED':
			return `Group created 🎉`
		default:
			return `[Unknown system event]`
	}
}

const ChatMessages: FC<ChatMessagesProps> = ({ messages, onTopReached, loadingTop, groupID }) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!loadingTop) {
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	useEffect(() => {
		const container = containerRef.current
		if (!container || !onTopReached) return

		let lastCalled = 0
		const handleScroll = () => {
			if (container.scrollTop < 100) {
				const now = Date.now()
				if (now - lastCalled > 1000) {
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
					const content = formatSystemMessage(msg)
					return (
						<div key={`${groupID}-${msg.id}`} className="system-message">
							<span>{content}</span>
						</div>
					)
				}

				return (
					<div key={`${groupID}-${msg.id}`} className="message-container">
						<RoundedPhoto size={40} />
						<div className="message-content">
							<div className="message-title">
								<strong className="message-sender">
									{msg.senderName || 'Unknown User'}
								</strong>
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
