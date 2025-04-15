import Layout from '../../components/Layout/Layout'
import UserCard from '../../components/UserCard/UserCard'
import EditProfileButton from '../../components/EditProfileButton/EditProfileButton'
import ActivityFeed from '../../components/ActivityFeed/ActivityFeed'

import './Profile.scss'

const Profile = () => {
	return (
		<Layout>
			<div className="profile-page">
				<div className="profile-sidebar">
					<UserCard />
					<EditProfileButton />
				</div>

				<div className="profile-main">
					<ActivityFeed image={''} title={''} time={''} />
				</div>
			</div>
		</Layout>
	)
}

export default Profile
