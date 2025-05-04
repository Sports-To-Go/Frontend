import { useState, useEffect, FC } from 'react'
import './UserCard.scss'
import { FaStar } from 'react-icons/fa'
import { useAuth } from '../../context/UserContext'
import { FiAlertTriangle } from 'react-icons/fi'
import ReportModal from '../ReportModal/ReportModal'

import placeholder from '../../assets/profilePhotoPlaceholder.png'

import axios from 'axios'
import { auth } from '../../firebase/firebase'

import { BACKEND_URL } from '../../../integration-config'

const UserCard: FC = () => {
	const { user } = useAuth()
	const [description, setDescription] = useState<string>('')
	const [showReportModal, setShowReportModal] = useState(false)

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const currentUser = auth.currentUser
				const token = await currentUser?.getIdToken()

				const response = await axios.get(`${BACKEND_URL}/users/profile`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				setDescription(response.data.description)
			} catch (error) {
				console.error('Error fetching user description:', error)
			}
		}

		fetchUserData()
	}, [user])

	return (
		<div className="user-card">
			<button
				className="report-button"
				title="Report User"
				onClick={() => setShowReportModal(true)}
			>
				<FiAlertTriangle />
			</button>

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

			<div className="badge-toggle">
				<span className="toggle-label">{description}</span>
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
