import { useState, useEffect } from 'react'
import './EditProfileModal.scss'
import DeleteProfileModal from '../DeleteProfileModal/DeleteProfileModal'
import axios from 'axios'
import { auth } from '../../firebase/firebase'
import { BACKEND_URL } from '../../../integration-config'
import { useAuth } from '../../context/UserContext'
import { updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import userplaceholder from '../../assets/userplaceholder.png'

interface Props {
	onClose: () => void
	description: string
	setDescription: (desc: string) => void
	interests: string[]
	setInterests: (interests: string[]) => void
}

const EditProfileModal = ({
	onClose,
	description,
	setDescription,
	interests,
	setInterests,
}: Props) => {
	const [tab, setTab] = useState<'profile' | 'important'>('profile')
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const { user, setUser } = useAuth()
	const [localDescription, setLocalDescription] = useState(description)
	const [localInterests, setLocalInterests] = useState<string[]>(interests)
	const [localDisplayName, setLocalDisplayName] = useState(user?.displayName || '')
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(user?.photoURL || null)
	const navigate = useNavigate()

	useEffect(() => {
		setLocalDescription(description)
		setLocalInterests(interests)
	}, [description, interests])
	useEffect(() => {
		setLocalDisplayName(user?.displayName || '')
		setImagePreviewUrl(user?.photoURL || null)
	}, [user?.displayName, user?.photoURL])

	const sports = ['Football', 'Basketball', 'Gym', 'Climbing', 'Tennis']

	const toggleInterest = (sport: string) => {
		setLocalInterests(
			localInterests.includes(sport)
				? localInterests.filter(s => s !== sport)
				: [...localInterests, sport],
		)
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0]
			setImageFile(file)
			setImagePreviewUrl(URL.createObjectURL(file))
		}
	}

	const handleRemoveImage = async () => {
		if (!auth.currentUser) return
		const token = await auth.currentUser.getIdToken()

		try {
			await axios.delete(`http://${BACKEND_URL}/users/profile/picture`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			setImageFile(null)
			setImagePreviewUrl(null)
			setUser(user ? { ...user, photoURL: null } : null)
		} catch (err) {
			console.error('Failed to remove profile image:', err)
		}
	}

	const handleApply = async () => {
		setDescription(localDescription)
		setInterests(localInterests)
		onClose()

		try {
			const token = await auth.currentUser?.getIdToken()

			// update Firebase profile
			await updateProfile(auth.currentUser!, {
				displayName: localDisplayName,
			})

			// prepare multipart form data
			const formData = new FormData()
			formData.append('description', localDescription)
			if (imageFile) {
				formData.append('image', imageFile)
			}

			const response = await axios.put(`http://${BACKEND_URL}/users/profile`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			})

			if (user) {
				setUser({
					...user,
					displayName: localDisplayName,
					description: response.data.description,
					photoURL: response.data.image?.url || null,
				})
				navigate(`/profile/${user.uid}`)
			}
		} catch (err) {
			console.error('Failed to update user profile:', err)
		}
	}

	return (
		<>
			<div className="edit-profile-modal-overlay">
				<div className="edit-profile-modal">
					<div className="edit-profile-modal__sidebar">
						<button
							className={tab === 'profile' ? 'active' : ''}
							onClick={() => setTab('profile')}
						>
							Profile
						</button>
						<button
							className={tab === 'important' ? 'active' : ''}
							onClick={() => setTab('important')}
						>
							Important
						</button>
					</div>

					<div className="edit-profile-modal__content-wrapper">
						<div className="edit-profile-modal__content">
							{tab === 'profile' ? (
								<>
									<div className="edit-profile-modal__picture-preview">
										<input
											type="file"
											accept="image/*"
											id="profile-photo-input"
											onChange={handleImageChange}
											style={{ display: 'none' }}
										/>
										
											<div className="preview-wrapper">
												<img
													src={imagePreviewUrl || userplaceholder}
													alt="Preview"
													className="image-preview"
													onClick={() =>
														document.getElementById('profile-photo-input')?.click()
													}
												/>
												<button
													type="button"
													className="remove-photo-button"
													onClick={handleRemoveImage}
												>
													Remove
												</button>
											</div>
										
									</div>

									<label>
										Username
										<input
											type="text"
											placeholder="ex: chucknorris123"
											value={localDisplayName}
											onChange={e => setLocalDisplayName(e.target.value)}
										/>
									</label>
									<label>
										Description
										<textarea
											placeholder="Short description..."
											value={localDescription}
											onChange={e => setLocalDescription(e.target.value)}
										/>
									</label>
									<label>
										Interests
										<div className="edit-profile-modal__interests">
											{sports.map(sport => (
												<div
													key={sport}
													className={`edit-profile-modal__interest ${
														localInterests.includes(sport) ? 'selected' : ''
													}`}
													onClick={() => toggleInterest(sport)}
												>
													{sport}
												</div>
											))}
										</div>
									</label>
								</>
							) : (
								<>
									<label>
										Full Name
										<input type="text" placeholder="Mock Mock" />
									</label>
									<label>
										Email
										<input type="email" value={user?.email || ''} readOnly />
									</label>
									<label>
										Phone
										<input type="tel" placeholder="0721 325 812" />
									</label>
									<button
										className="edit-profile-modal__delete-button"
										onClick={() => setShowDeleteModal(true)}
									>
										Delete Profile
									</button>
								</>
							)}
						</div>

						<div className="edit-profile-modal__footer">
							<button className="edit-profile-modal__footer-button cancel" onClick={onClose}>
								Cancel
							</button>
							<button className="edit-profile-modal__footer-button" onClick={handleApply}>
								Apply
							</button>
						</div>
					</div>
				</div>
			</div>

			{showDeleteModal && (
				<DeleteProfileModal
					onClose={() => setShowDeleteModal(false)}
					onConfirm={(password: string) => {
						console.log('Delete confirmed with password:', password)
					}}
				/>
			)}
		</>
	)
}

export default EditProfileModal
