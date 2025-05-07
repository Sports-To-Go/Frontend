import Layout from '../../components/Layout/Layout'
import UserCard from '../../components/UserCard/UserCard'
import EditProfileButton from '../../components/EditProfileButton/EditProfileButton'
import ActivityFeed from '../../components/ActivityFeed/ActivityFeed'
import { FC } from 'react'
import './Profile.scss'

interface ProfileProps {
	description: string
}

const Profile: FC<ProfileProps> = ({ description }) => {
	return (
		<Layout>
			<div className="profile-page">
				<div className="profile-sidebar">
					<UserCard description={description} />
					<EditProfileButton />
				</div>

				<div className="profile-main">
					<ActivityFeed />
				</div>
			</div>
		</Layout>
	)
}

export default Profile
