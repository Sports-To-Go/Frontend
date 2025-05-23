import { FC } from 'react'
import RoundedPhoto from '../RoundedPhoto/RoundedPhoto'
import { CiSettings } from 'react-icons/ci'
import './ChatHeader.scss'

interface ChatHeaderProps {
    groupName: string
    status: string
    onBack: () => void
    onOpenSettings: () => void
}

const ChatHeader: FC<ChatHeaderProps> = ({ groupName, status, onBack, onOpenSettings }) => {
    return (
        <div className="chat-header">
            <div className="header-title">
                <span className="back-arrow" onClick={onBack}>
                    {'<'}
                </span>
                <RoundedPhoto size={40} imagePath={`https://i.pravatar.cc/40`} />
                <div className="title">
                    <div>{groupName}</div>
                    <div className={status === 'online' ? 'active' : 'offline'}>
                        {status === 'online' ? 'active now' : 'offline'}
                    </div>
                </div>
            </div>
            <CiSettings cursor="pointer" onClick={onOpenSettings} />
        </div>
    )
}

export default ChatHeader
