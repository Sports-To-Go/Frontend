import { GoGear } from 'react-icons/go'
import { useAuth } from '../../context/UserContext'
import ShareProfileButton from '../ShareProfileButton/ShareProfileButton'

import './ProfileActions.scss'

const ProfileActions = () => {
	const { user } = useAuth()
	const username = user?.displayName || 'unknown'

	return (
		<div className="profile-actions">
			<button className="profile-action-button">
				<GoGear className="icon" />
				<span>Edit Profile</span>
			</button>

			<ShareProfileButton username={username} />
		</div>
	)
}

export default ProfileActions
