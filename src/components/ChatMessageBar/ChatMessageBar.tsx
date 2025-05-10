import { FC } from 'react'
import { MdLink } from 'react-icons/md'
import { FiMessageCircle } from 'react-icons/fi'
import './ChatMessageBar.scss'

interface ChatMessageBarProps {
    newMessage: string
    onMessageChange: (value: string) => void
    onSendMessage: () => void
}

const ChatMessageBar: FC<ChatMessageBarProps> = ({ newMessage, onMessageChange, onSendMessage }) => {
    return (
        <div className="chat-message-bar">
            <MdLink onClick={() => alert('links to be added')} cursor="pointer" />
            <div className="message-bar-container">
                <input
                    type="text"
                    className="message-input"
                    placeholder="Aa"
                    value={newMessage}
                    onChange={e => onMessageChange(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') onSendMessage()
                    }}
                />
                <FiMessageCircle onClick={onSendMessage} cursor="pointer" />
            </div>
        </div>
    )
}

export default ChatMessageBar
