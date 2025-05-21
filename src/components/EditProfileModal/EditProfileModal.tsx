import { useState, useEffect } from 'react'
import './EditProfileModal.scss'
import DeleteProfileModal from '../DeleteProfileModal/DeleteProfileModal'
import axios from 'axios'
import { auth } from '../../firebase/firebase'
import { BACKEND_URL } from '../../../integration-config'
import { useAuth } from '../../context/UserContext'

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

	useEffect(() => {
		setLocalDescription(description)
		setLocalInterests(interests)
	}, [description, interests])

	const sports = ['Football', 'Basketball', 'Gym', 'Climbing', 'Tennis']

	const toggleInterest = (sport: string) => {
		setLocalInterests(
			localInterests.includes(sport)
				? localInterests.filter(s => s !== sport)
				: [...localInterests, sport],
		)
	}

	const handleDelete = (password: string) => {
		console.log('Delete confirmed with password:', password)
		// aici vei trimite datele spre backend în viitor
	}

	return (
		<>
			<div className="edit-profile-modal-overlay">
				<div className="edit-profile-modal">
					{/* Sidebar */}
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

					{/* Content + Footer */}
					<div className="edit-profile-modal__content-wrapper">
						<div className="edit-profile-modal__content">
							{tab === 'profile' ? (
								<>
									<div className="edit-profile-modal__picture-preview">
										<img src="https://i.pravatar.cc/100?u=mockuser" alt="Preview" />
										<label className="upload-label">
											Change Picture
											<input type="file" accept="image/*" />
										</label>
									</div>

									<label>
										Username
										<input type="text" placeholder="ex: chucknorris123" />
									</label>
									<label>
										Description
										<textarea
											placeholder="Short description..."
											value={localDescription}
											onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
												setLocalDescription(e.target.value)
											}
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
										<input type="email" placeholder="mock@mock-email.com" />
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
							<button
								className="edit-profile-modal__footer-button"
								onClick={async () => {
									setDescription(localDescription)
									setInterests(localInterests)
									onClose()

									try {
										const token = await auth.currentUser?.getIdToken()

										const response = await axios.put(
											`${BACKEND_URL}/users/profile`,
											{
												description: localDescription,
											},
											{
												headers: {
													Authorization: `Bearer ${token}`,
												},
											},
										)

										if (user) {
											setUser({
												...user,
												description: response.data.description,
											})
										}
									} catch (err) {
										console.error('Failed to update user profile:', err)
									}
								}}
							>
								Apply
							</button>
						</div>
					</div>
				</div>
			</div>

			{showDeleteModal && (
				<DeleteProfileModal
					onClose={() => setShowDeleteModal(false)}
					onConfirm={handleDelete}
				/>
			)}
		</>
	)
}

export default EditProfileModal
