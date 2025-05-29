import { GoGear } from 'react-icons/go'
import ShareProfileButton from '../ShareProfileButton/ShareProfileButton'

import './ProfileActions.scss'

interface Props {
	onEditClick: () => void
	username?: string
}

const ProfileActions = ({ onEditClick, username = 'unknown' }: Props) => {
	return (
		<div className="profile-actions">
			<button className="profile-action-button" onClick={onEditClick}>
				<GoGear className="icon" />
				<span>Edit Profile</span>
			</button>

			<ShareProfileButton username={username} />
		</div>
	)
}

export default ProfileActions
