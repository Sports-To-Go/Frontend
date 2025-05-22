import React from 'react'
import { CiUser } from 'react-icons/ci'
import './ChatPreview.scss'

interface GroupPreviewProps {
	image: string
	isOnline: boolean
	name: string
	description: string
	members: number
	onClick?: () => void
}

const GroupPreview: React.FC<GroupPreviewProps> = React.memo(
	({ name, image, isOnline, description, members, onClick }) => {
		return (
			<li className="message-item" onClick={onClick}>
				<div className="group-avatar-container">
					<img
						src={
							image != ''
								? image
								: 'https://dashboard.codeparrot.ai/api/image/Z_T76IDi91IKZZrg/image.png'
						}
						alt={`${name}'s avatar`}
						className="group-avatar"
					/>
					<div className={`online-indicator ${isOnline ? 'online' : ''}`} />
				</div>
				<div className="group-info">
					<div className="group-name">{name}</div>
					<div className="group-description">{description}</div>
				</div>
				<div className="members-info">
					<CiUser />
					<span className="members-count">{members}</span>
				</div>
			</li>
		)
	},
)

export default GroupPreview
