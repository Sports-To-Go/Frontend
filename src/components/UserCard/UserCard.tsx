import { useState, FC } from 'react'
import './UserCard.scss'
import { FaStar } from 'react-icons/fa'
import { useAuth } from '../../context/UserContext'
import { FiAlertTriangle } from 'react-icons/fi'
import ReportModal from '../ReportModal/ReportModal'
import { useParams } from 'react-router-dom'

import placeholder from '../../assets/profilePhotoPlaceholder.png'

const UserCard: FC = () => {
	const { user } = useAuth()
	const { username } = useParams()
	const isMyProfile = user?.displayName === username
	const [showReportModal, setShowReportModal] = useState(false)

	return (
		<div className="user-card">
			{!isMyProfile && (
				<button
					className="report-button"
					title="Report User"
					onClick={() => setShowReportModal(true)}
				>
					<FiAlertTriangle />
				</button>
			)}

			<div className="user-card__header">
				<div className="user-card__avatar">
					<img src={user?.photoURL ? user.photoURL : placeholder} alt="User avatar" />
				</div>

				<div className="user-card__info">
					<h1 className="user-card__name">{user?.displayName}</h1>
					<div className="user-card__rating">
						{[...Array(5)].map((_, i) => (
							<FaStar key={i} />
						))}
					</div>
				</div>
			</div>

			{showReportModal && (
				<ReportModal
					onClose={() => setShowReportModal(false)}
					onSubmit={reason => {
						console.log('Reported with reason:', reason)
					}}
				/>
			)}
		</div>
	)
}

export default UserCard
