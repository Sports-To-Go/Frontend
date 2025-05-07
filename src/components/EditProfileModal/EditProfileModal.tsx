import { useState } from 'react'
import './EditProfileModal.scss'
import DeleteProfileModal from '../DeleteProfileModal/DeleteProfileModal'

interface Props {
	onClose: () => void
}

const EditProfileModal = ({ onClose }: Props) => {
	const [tab, setTab] = useState<'profile' | 'important'>('profile')
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const sports = ['Football', 'Basketball', 'Gym', 'Climbing', 'Tennis']
	const [selectedInterests, setSelectedInterests] = useState<string[]>([])

	const toggleInterest = (sport: string) => {
		setSelectedInterests(prev =>
			prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport],
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
										<textarea placeholder="Short description..." />
									</label>
									<label>
										Interests
										<div className="edit-profile-modal__interests">
											{sports.map(sport => (
												<div
													key={sport}
													className={`edit-profile-modal__interest ${
														selectedInterests.includes(sport) ? 'selected' : ''
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
							<button className="edit-profile-modal__footer-button" onClick={onClose}>
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
