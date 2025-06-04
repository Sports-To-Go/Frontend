import { FC } from 'react'
import RoundedPhoto from '../RoundedPhoto/RoundedPhoto'
import { CiSettings } from 'react-icons/ci'
import './ChatHeader.scss'
import groupplaceholder from '../../assets/groupplaceholder.png'

interface ChatHeaderProps {
    groupName: string
    status: string
    image?: string
    onBack: () => void
    onOpenSettings: () => void
}

const ChatHeader: FC<ChatHeaderProps> = ({groupName, status, image, onBack, onOpenSettings}) => {
    return (
        <div className="chat-header">
            <div className="header-title">
                <span className="back-arrow" onClick={onBack}>
                    {'<'}
                </span>
                <RoundedPhoto size={40} imagePath={
							image || groupplaceholder
						} />
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
