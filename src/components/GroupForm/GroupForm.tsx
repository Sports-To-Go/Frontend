import { FC, useState } from 'react'
import './GroupForm.scss'
import { useSocial } from '../../context/SocialContext'

interface GroupFormProps {
	onClose: () => void
}

const GroupForm: FC<GroupFormProps> = ({ onClose }) => {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [photo, setPhoto] = useState<File | null>(null)

	const { createGroup } = useSocial()

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setPhoto(e.target.files[0])
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		createGroup(name, description)
		setName('')
		setDescription('')
		setPhoto(null)
	}

	return (
		<div className="group-form-container">
			{/* Photo Upload Button */}
			<div className="photo-upload-container">
				<input
					type="file"
					accept="image/*"
					onChange={handlePhotoChange}
					id="photo-input"
					style={{ display: 'none' }} // Hide the file input
				/>
				<label htmlFor="photo-input" className="add-group-photo-button">
					+
				</label>
			</div>
			<h2>Create a New Group</h2>
			<form onSubmit={handleSubmit}>
				<label>
					Group Name
					<input
						type="text"
						value={name}
						onChange={e => setName(e.target.value)}
						placeholder="Enter group name"
						required
					/>
				</label>
				<label>
					Description
					<textarea
						value={description}
						onChange={e => setDescription(e.target.value)}
						placeholder="Enter group description"
					/>
				</label>
				<div className="form-buttons">
					<button type="submit">Create</button>
					<button type="button" onClick={onClose}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	)
}

export default GroupForm
