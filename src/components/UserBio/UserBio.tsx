import './UserBio.scss'
import { useAuth } from '../../context/UserContext'

const UserBio = () => {
	const { user } = useAuth()

	return (
		<div className="user-bio-container">
			<div className="user-bio-header">User Description</div>
			<div className="user-bio-content">
				{user?.description || 'No description provided.'}
			</div>
		</div>
	)
}

export default UserBio
