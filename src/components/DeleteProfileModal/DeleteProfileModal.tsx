import { useState } from 'react'
import './DeleteProfileModal.scss'

interface DeleteProfileModalProps {
	onClose: () => void
	onConfirm: (password: string) => void
}

const DeleteProfileModal = ({ onClose, onConfirm }: DeleteProfileModalProps) => {
	const [password, setPassword] = useState('')

	const handleConfirm = () => {
		if (password.trim()) {
			onConfirm(password)
		}
	}

	return (
		<div className="delete-profile-modal-overlay">
			<div className="delete-profile-modal">
				<h3 className="delete-profile-modal__title">Delete Profile</h3>
				<p className="delete-profile-modal__message">
					This action is irreversible. Please enter your password to confirm.
				</p>
				<input
					type="password"
					className="delete-profile-modal__input"
					placeholder="Enter your password"
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<div className="delete-profile-modal__actions">
					<button className="delete-profile-modal__button cancel" onClick={onClose}>
						Cancel
					</button>
					<button className="delete-profile-modal__button delete" onClick={handleConfirm}>
						Delete
					</button>
				</div>
			</div>
		</div>
	)
}

export default DeleteProfileModal
