import { useState } from 'react'
import './ReportModal.scss'

interface ReportModalProps {
	onClose: () => void
	onSubmit: (reason: string) => void
}

const ReportModal = ({ onClose, onSubmit }: ReportModalProps) => {
	const [reason, setReason] = useState('')

	const handleSubmit = () => {
		if (reason.trim()) {
			onSubmit(reason)
			onClose()
		}
	}

	return (
		<div className="report-modal-overlay">
			<div className="report-modal fade-in">
				<h3 className="report-modal__title">Report User</h3>

				<textarea
					className="report-modal__textarea"
					placeholder="Why are you reporting this user?"
					value={reason}
					onChange={e => setReason(e.target.value)}
				/>

				<div className="report-modal__actions">
					<button className="report-modal__button cancel" onClick={onClose}>
						Cancel
					</button>
					<button className="report-modal__button send" onClick={handleSubmit}>
						Send
					</button>
				</div>
			</div>
		</div>
	)
}

export default ReportModal
