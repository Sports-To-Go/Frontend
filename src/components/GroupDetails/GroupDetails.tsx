import React from 'react'
import './GroupDetails.scss'
import { auth } from '../../firebase/firebase'
import axios from 'axios'
import { BACKEND_URL } from '../../../integration-config'
import { useSocial } from '../../context/SocialContext'

interface GroupDetailsProps {
	image: string
	name: string
	description: string
	members: number
	isOnline: boolean
	groupID: number
	onBack: () => void
}

const GroupDetails: React.FC<GroupDetailsProps> = ({
	image,
	name,
	description,
	members,
	isOnline,
	groupID,
	onBack,
}) => {
	const { joinGroup } = useSocial()

	return (
		<div className="group-details">
			<button className="back-button" onClick={onBack}>
				Back
			</button>

			<div className="group-header">
				<img
					src={
						image != ''
							? image
							: 'https://dashboard.codeparrot.ai/api/image/Z_T76IDi91IKZZrg/image.png'
					}
					alt={`${name}'s avatar`}
					className="group-image"
				/>
				<div className="group-status">
					<h1 className="group-name">{name}</h1>
					<div className={`online-indicator ${isOnline ? 'online' : ''}`}>
						{isOnline ? 'Online' : 'Offline'}
					</div>
				</div>
			</div>

			<div className="group-description-section">
				<h2>Description</h2>
				<p>{description}</p>
			</div>

			<div className="group-members-section">
				<h2>Members</h2>
				<p>{members} members</p>
			</div>

			{/*Apply button*/}
			<div className="modal-button-container">
				<button className="modal-button" onClick={() => joinGroup(groupID)}>
					Apply
				</button>
			</div>
		</div>
	)
}

export default GroupDetails
