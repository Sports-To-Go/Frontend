import { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import UserCard from '../../components/UserCard/UserCard'
import ActivityFeed from '../../components/ActivityFeed/ActivityFeed'
import UserReviews from '../../components/UserReviews/UserReviews'
import ProfileActions from '../../components/ProfileActions/ProfileActions'
import UserInterests from '../../components/UserInterests/UserInterests'
import UserBio from '../../components/UserBio/UserBio'
import EditProfileModal from '../../components/EditProfileModal/EditProfileModal'

import './Profile.scss'
import ProfileActionsExternal from '../../components/ProfileActionsExternal/ProfileActionsExternal'

const Profile = () => {
	const [description, setDescription] = useState('This is a default bio.')
	const [interests, setInterests] = useState<string[]>(['Football', 'Basketball'])
	const [isEditModalOpen, setEditModalOpen] = useState(false)

	return (
		<Layout>
			<div className="profile-page">
				<div className="profile-sidebar">
					<UserCard />
					<ProfileActions onEditClick={() => setEditModalOpen(true)} username="mockUser" />
					{/*<ProfileActionsExternal/> */}

					<UserInterests interests={interests} />
					<UserBio description={description} />
				</div>

				<div className="profile-main">
					<ActivityFeed />
					<UserReviews />
				</div>

				{isEditModalOpen && (
					<EditProfileModal
						onClose={() => setEditModalOpen(false)}
						description={description}
						setDescription={setDescription}
						interests={interests}
						setInterests={setInterests}
					/>
				)}
			</div>
		</Layout>
	)
}

export default Profile
