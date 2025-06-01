import { useState } from 'react'
import './WriteReviewModal.scss'
import { FaStar } from 'react-icons/fa'

interface Props {
	onClose: () => void
	onSubmit: (rating: number, review: string) => void
}

const WriteReviewModal = ({ onClose, onSubmit }: Props) => {
	const [rating, setRating] = useState(0)
	const [reviewText, setReviewText] = useState('')

	const handleSubmit = () => {
		onSubmit(rating, reviewText)
		onClose()
	}

	return (
		<div className="write-review-modal-overlay">
			<div className="write-review-modal">
				<h3 className="write-review-modal__title">Write a Review</h3>
				<div className="write-review-modal__rating">
					{[...Array(5)].map((_, i) => (
						<FaStar
							key={i}
							className={i < rating ? 'selected' : ''}
							onClick={() => setRating(i + 1)}
						/>
					))}
				</div>

				<textarea
					className="write-review-modal__textarea"
					placeholder="Write your review here..."
					value={reviewText}
					onChange={e => setReviewText(e.target.value)}
				/>

				<div className="write-review-modal__actions">
					<button className="write-review-modal__button cancel" onClick={onClose}>
						Cancel
					</button>
					<button className="write-review-modal__button submit" onClick={handleSubmit}>
						Submit
					</button>
				</div>
			</div>
		</div>
	)
}

export default WriteReviewModal
