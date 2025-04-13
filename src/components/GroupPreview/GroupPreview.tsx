import React from 'react'
import { CiUser } from 'react-icons/ci'
import './GroupPreview.scss'

interface groupPreviewProps {
	image: string
	isOnline: boolean
	name: string
	description: string
	members: number
}

const GroupPreview: React.FC<groupPreviewProps> = ({
	image,
	isOnline,
	name,
	description,
	members,
}) => {
	return (
		<li className="message-item">
			<div className="group-avatar-container">
				<img src={image} alt={`${name}'s avatar`} className="group-avatar" />
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
}

export default GroupPreview
