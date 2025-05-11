import Layout from '../../components/Layout/Layout'
import UserCard from '../../components/UserCard/UserCard'
import ActivityFeed from '../../components/ActivityFeed/ActivityFeed'
import UserReviews from '../../components/UserReviews/UserReviews'
import ProfileActions from '../../components/ProfileActions/ProfileActions'
import ProfileActionsExternal from '../../components/ProfileActionsExternal/ProfileActionsExternal'
import UserInterests from '../../components/UserInterests/UserInterests'
import UserBio from '../../components/UserBio/UserBio'

import './Profile.scss'

const Profile = () => {
	return (
		<Layout>
			<div className="profile-page">
				<div className="profile-sidebar">
					<UserCard />
					{/* <ProfileActions /> */}
					<ProfileActionsExternal />
					<UserInterests />
					<UserBio />
				</div>

				<div className="profile-main">
					<ActivityFeed />
					<UserReviews />
				</div>
			</div>
		</Layout>
	)
}

export default Profile
