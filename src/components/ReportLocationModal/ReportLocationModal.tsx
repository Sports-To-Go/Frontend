import React, { useState } from 'react'
import './ReportLocationModal.scss'
import { auth } from '../../firebase/firebase'
import { BACKEND_URL } from '../../../integration-config'
import axios from 'axios'

interface ReportLocationProps {
	close: () => void
	locationId: number
	locationName: string
}

const ReportLocationModal: React.FC<ReportLocationProps> = ({
	close,
	locationId,
	locationName,
}) => {
	const [reason, setReason] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const currentUser = auth.currentUser
		if (!currentUser) return

		try {
			const token = await currentUser.getIdToken(true)

			await axios.post(
				`http://${BACKEND_URL}/admin/reports`,
				{
					reportedBy: currentUser.uid,
					targetType: 'Location',
					targetId: locationId,
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

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			close()
		}
	}

	return (
		<div className="reservation-overlay" onClick={handleOverlayClick}>
			<div className="report-location--modal">
				<h2>Report {locationName}</h2>
				<form onSubmit={handleSubmit}>
					<label htmlFor="reason">Reason for report</label>
					<textarea
						id="reason"
						placeholder="Write your reason here..."
						value={reason}
						onChange={e => setReason(e.target.value)}
						required
					/>
					<div className="button-group">
						<button type="button" className="cancel-btn" onClick={close}>
							Cancel
						</button>
						<button type="submit" className="submit-btn" onClick={handleSubmit}>
							Submit Report
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default ReportLocationModal
