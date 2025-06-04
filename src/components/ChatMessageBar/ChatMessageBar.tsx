import { FC, useRef } from 'react'
import { MdLink } from 'react-icons/md'
import { FiMessageCircle } from 'react-icons/fi'
import './ChatMessageBar.scss'
import { useSocial } from '../../context/SocialContext'

interface ChatMessageBarProps {
	newMessage: string
	onMessageChange: (value: string) => void
}

const ChatMessageBar: FC<ChatMessageBarProps> = ({ newMessage, onMessageChange }) => {
	const { sendTextMessage, sendImageMessage } = useSocial()
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	return (
		<div className="chat-message-bar">
			<MdLink onClick={() => fileInputRef.current?.click()} cursor="pointer" />

			<input
				type="file"
				accept="image/*"
				style={{ display: 'none' }}
				ref={fileInputRef}
				onChange={e => {
					const file = e.target.files?.[0]
					if (file) {
						sendImageMessage(file)
						e.target.value = ''
					}
				}}
			/>

			<div className="message-bar-container">
				<input
					type="text"
					className="message-input"
					placeholder="Aa"
					value={newMessage}
					onChange={e => onMessageChange(e.target.value)}
					onKeyDown={e => {
						if (e.key === 'Enter') sendTextMessage(newMessage)
					}}
				/>
				<FiMessageCircle
					onClick={() => sendTextMessage(newMessage)}
					cursor="pointer"
				/>
			</div>
		</div>
	)
}

export default ChatMessageBar
