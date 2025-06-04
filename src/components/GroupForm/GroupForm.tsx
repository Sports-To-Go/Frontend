import { FC, useState } from 'react'
import './GroupForm.scss'
import { useSocial } from '../../context/SocialContext'
import Spinner from '../Spinner/Spinner'

interface GroupFormProps {
	onClose: () => void
}

const GroupForm: FC<GroupFormProps> = ({ onClose }) => {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [photo, setPhoto] = useState<File | null>(null)
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
	const [isCreating, setIsCreating] = useState(false)

	const { createGroup } = useSocial()

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0]
			setPhoto(file)
			setImagePreviewUrl(URL.createObjectURL(file))
		}
	}

	const handleRemovePhoto = () => {
		setPhoto(null)
		setImagePreviewUrl(null)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsCreating(true)
		try {
			await createGroup(name, description, photo)
			setName('')
			setDescription('')
			setPhoto(null)
			setImagePreviewUrl(null)
			onClose()
		} catch (err) {
			console.error('Error creating group:', err)
		} finally {
			setIsCreating(false)
		}
	}

	return (
		<div className="group-form-container">
			<div className="photo-upload-container">
				<input
					type="file"
					accept="image/*"
					onChange={handlePhotoChange}
					id="photo-input"
					style={{ display: 'none' }}
					disabled={isCreating}
				/>
				{imagePreviewUrl ? (
					<div className="preview-wrapper">
						<img
							src={imagePreviewUrl}
							alt="Preview"
							className="image-preview"
							onClick={() => !isCreating && document.getElementById('photo-input')?.click()}
						/>
						<button
							type="button"
							className="remove-photo-button"
							onClick={handleRemovePhoto}
							disabled={isCreating}
						>
							Remove
						</button>
					</div>
				) : (
					<label htmlFor="photo-input" className="add-group-photo-button">
						+
					</label>
				)}
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
						disabled={isCreating}
					/>
				</label>
				<label>
					Description
					<textarea
						value={description}
						onChange={e => setDescription(e.target.value)}
						placeholder="Enter group description"
						disabled={isCreating}
					/>
				</label>

				<div className="form-buttons">
					{isCreating ? (
						<Spinner size={28} />
					) : (
						<>
							<button type="submit" disabled={isCreating}>
								Create
							</button>
							<button type="button" onClick={onClose} disabled={isCreating}>
								Cancel
							</button>
						</>
					)}
				</div>
			</form>
		</div>
	)
}

export default GroupForm
