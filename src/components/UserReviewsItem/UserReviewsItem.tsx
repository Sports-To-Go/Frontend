import React from 'react'
import userplaceholder from '../../assets/userplaceholder.png'

interface UserReviewItemProps {
	review: {
		date: string
		text: string
		reportedBy: number
		reporterImageUrl?: string
	}
	index: number
}

const UserReviewItem: React.FC<UserReviewItemProps> = ({ review, index }) => {
	return (
		<div className="user-reviews__item">
			<div className="user-reviews__avatar">
				<img
					src={review.reporterImageUrl || userplaceholder}
					alt={`Avatar ${index}`}
				/>
			</div>

			<div className="user-reviews__details">
				<p className="user-reviews__date">{review.reportedBy} - {review.date}</p>
				<p className="user-reviews__text">{review.text}</p>
			</div>
		</div>
	)
}

export default UserReviewItem
