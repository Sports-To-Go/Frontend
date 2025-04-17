import React from 'react'
import { GoGear } from 'react-icons/go'
import './EditProfileButton.scss'

const EditProfileButton: React.FC = () => {
	return (
		<div className="edit-profile-button">
			<GoGear className="icon" />
			<span>Edit profile</span>
		</div>
	)
}

export default EditProfileButton
