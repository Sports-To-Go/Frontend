import { useState } from 'react'
import { FaRegCommentDots } from 'react-icons/fa6'
import { useAuth } from '../../context/UserContext'
import ShareProfileButton from '../ShareProfileButton/ShareProfileButton'
import WriteReviewModal from '../WriteReviewModal/WriteReviewModal'

import './ProfileActionsExternal.scss'

const ProfileActionsExternal = () => {
	const { user } = useAuth()
	const username = user?.displayName || 'unknown'
	const [showModal, setShowModal] = useState(false)

	const handleReviewSubmit = (rating: number, review: string) => {
		console.log('Review submitted:', { rating, review })
	}

	return (
		<div className="profile-actions-external">
			<button className="profile-action-button" onClick={() => setShowModal(true)}>
				<FaRegCommentDots className="icon" />
				<span>Write Review</span>
			</button>

			<ShareProfileButton username={username} />

			{showModal && (
				<WriteReviewModal onClose={() => setShowModal(false)} onSubmit={handleReviewSubmit} />
			)}
		</div>
	)
}

export default ProfileActionsExternal
