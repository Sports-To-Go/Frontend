import { FC } from 'react'
import './GroupChat.scss'

import RoundedPhoto from '../RoundedPhoto/RoundedPhoto'

import { CiSettings } from 'react-icons/ci'
import { MdLink } from 'react-icons/md'
import { FiMessageCircle } from "react-icons/fi";

interface GroupProps {
	groupID: number
}

const GroupChat: FC<GroupProps> = ({ groupID }) => {
	const groupName = 'Group #' + groupID
	const status = 'online'

	return (
		<div className="chat-container">
			<div className="chat-header">
				<div className="header-title">
					<RoundedPhoto size={37} />
					<div className="title">
						<div>{groupName}</div>
						{status === 'online' ? (
							<div className="active">active now</div>
						) : (
							<div className="offline">offline</div>
						)}
					</div>
				</div>
				<CiSettings
					cursor={'pointer'}
					onClick={() => {
						alert('chat settings to be implemented')
					}}
				/>
			</div>
			<div className="chat-messages"></div>
			<div className="chat-message-bar">
				<MdLink onClick={() => alert('links to be added')} cursor={"pointer"}/>
				<div className="message-bar-container">
					<input type="text" className="message-input" placeholder='Aa'/>
                    <FiMessageCircle onClick={() => alert('sending messages to be implemented')} cursor={"pointer"}/>
				</div>
			</div>
		</div>
	)
}

export default GroupChat
