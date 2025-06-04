import { FC, useEffect, useState } from 'react'
import './UserCard.scss'
import { useAuth } from '../../context/UserContext'
import { FiAlertTriangle } from 'react-icons/fi'
import ReportModal from '../ReportModal/ReportModal'
import { useParams } from 'react-router-dom'
import { auth } from '../../firebase/firebase'

import userplaceholder from '../../assets/userplaceholder.png'
import axios from 'axios'
import { BACKEND_URL } from '../../../integration-config'

const UserCard: FC = () => {
	const { user } = useAuth()
	const { uid } = useParams()
	const isMyProfile = user?.uid === uid
	const [showReportModal, setShowReportModal] = useState(false)

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const currentUser = auth.currentUser
				if (!currentUser) return
			} catch (error) {
				console.error('Error fetching user description:', error)
			}
		}

		if (user) {
			fetchUserData()
		}
	}, [user])

	const handleSubmit = async (e: React.FormEvent, reason: string) => {
		e.preventDefault()
		const currentUser = auth.currentUser
		if (!currentUser) return

		try {
			const token = await currentUser.getIdToken(true)

			await axios.post(
				`http://${BACKEND_URL}/admin/reports`,
				{
					reportedBy: currentUser.displayName,
					targetType: 'User',
					targetId: uid,
					reason: reason,
					status: 'Open',
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				},
			)
		} catch (error) {
			console.error('Error posting report:', error)
		}

		close()
	}

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
					<img src={user?.photoURL ? user.photoURL : userplaceholder} alt="User avatar" />
				</div>

				<div className="user-card__info">
					<h1 className="user-card__name">{user?.displayName}</h1>
				</div>
			</div>

			{showReportModal && (
				<ReportModal
					onClose={() => setShowReportModal(false)}
					onSubmit={(e: React.FormEvent, reason) => {
						handleSubmit(e, reason)
					}}
				/>
			)}
		</div>
	)
}

export default UserCard
