import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/UserContext'
import { useState } from 'react'

import Layout from '../../components/Layout/Layout'
import UserCard from '../../components/UserCard/UserCard'
import ActivityFeed from '../../components/ActivityFeed/ActivityFeed'
import UserReviews from '../../components/UserReviews/UserReviews'
import ProfileActions from '../../components/ProfileActions/ProfileActions'
import ProfileActionsExternal from '../../components/ProfileActionsExternal/ProfileActionsExternal'
import UserInterests from '../../components/UserInterests/UserInterests'
import UserBio from '../../components/UserBio/UserBio'
import EditProfileModal from '../../components/EditProfileModal/EditProfileModal'

import './Profile.scss'

const Profile = () => {
	const { username } = useParams()
	const { user } = useAuth()

	const [description, setDescription] = useState(user?.description || '')
	const [interests, setInterests] = useState<string[]>([]) // dacă o să le adaugi ulterior

	const [isEditModalOpen, setEditModalOpen] = useState(false)

	const isMyProfile = user?.displayName === username

	return (
		<Layout>
			<div className="profile-page">
				<div className="profile-sidebar">
					<UserCard />

					{isMyProfile ? (
						<ProfileActions
							onEditClick={() => setEditModalOpen(true)}
							username={username || ''}
						/>
					) : (
						<ProfileActionsExternal />
					)}

					<UserInterests interests={interests} />
					<UserBio />
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
