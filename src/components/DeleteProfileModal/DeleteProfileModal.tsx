import { useState } from 'react'
import './DeleteProfileModal.scss'
import {
	getAuth,
	EmailAuthProvider,
	GoogleAuthProvider,
	FacebookAuthProvider,
	GithubAuthProvider,
	reauthenticateWithCredential,
	reauthenticateWithPopup,
} from 'firebase/auth'
import axios from 'axios'
import { BACKEND_URL } from '../../../integration-config'
import { toast } from 'react-toastify'

interface DeleteProfileModalProps {
	onClose: () => void
}

const DeleteProfileModal = ({ onClose }: DeleteProfileModalProps) => {
	const [password, setPassword] = useState('')

	const handleConfirm = async () => {
		const auth = getAuth()
		const user = auth.currentUser

		if (!user) {
			toast.error('No authenticated user.')
			return
		}

		try {
			const providerId = user.providerData[0]?.providerId

			if (providerId === 'password') {
				if (!password.trim()) {
					toast.error('Please enter your password.')
					return
				}
				const credential = EmailAuthProvider.credential(user.email!, password)
				await reauthenticateWithCredential(user, credential)
			} else {
				let provider
				switch (providerId) {
					case 'google.com':
						provider = new GoogleAuthProvider()
						break
					case 'facebook.com':
						provider = new FacebookAuthProvider()
						break
					case 'github.com':
						provider = new GithubAuthProvider()
						break
					default:
						throw new Error('Unsupported provider for reauthentication.')
				}
				await reauthenticateWithPopup(user, provider)
			}

			// backend delete
			await axios.delete(`http://${BACKEND_URL}/users/profile`, {
				headers: {
					Authorization: `Bearer ${await user.getIdToken()}`,
				},
			})

			// firebase delete
			await user.delete()

			toast.success('Account deleted successfully.')
			onClose()
			window.location.href = '/login'
		} catch (error) {
			console.error(error)
			toast.error('Failed to delete account. Please try again.')
		}
	}

	return (
		<div className="delete-profile-modal-overlay">
			<div className="delete-profile-modal">
				<h3 className="delete-profile-modal__title">Delete Profile</h3>
				<p className="delete-profile-modal__message">
					This action is irreversible. Please confirm your identity.
				</p>

				{/* Show password field only for email users */}
				{getAuth().currentUser?.providerData[0]?.providerId === 'password' && (
					<input
						type="password"
						className="delete-profile-modal__input"
						placeholder="Enter your password"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				)}

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
