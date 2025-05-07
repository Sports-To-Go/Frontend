import { useState } from 'react'
import { GoGear } from 'react-icons/go'
import { useAuth } from '../../context/UserContext'
import ShareProfileButton from '../ShareProfileButton/ShareProfileButton'
import EditProfileModal from '../EditProfileModal/EditProfileModal'

import './ProfileActions.scss'

const ProfileActions = () => {
	const { user } = useAuth()
	const username = user?.displayName || 'unknown'

	const [showEditModal, setShowEditModal] = useState(false)

	return (
		<div className="profile-actions">
			<button className="profile-action-button" onClick={() => setShowEditModal(true)}>
				<GoGear className="icon" />
				<span>Edit Profile</span>
			</button>

			<ShareProfileButton username={username} />

			{showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
		</div>
	)
}

export default ProfileActions
