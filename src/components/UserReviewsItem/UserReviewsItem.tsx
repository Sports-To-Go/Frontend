import React from 'react'
import { FaStar } from 'react-icons/fa'

interface UserReviewItemProps {
	review: {
		date: string
		text: string
		rating: number
	}
	index: number
}

const UserReviewItem: React.FC<UserReviewItemProps> = ({ review, index }) => {
	return (
		<div className="user-reviews__item">
			<div className="user-reviews__avatar">
				<img src={`https://i.pravatar.cc/100?img=${index + 10}`} alt={`Avatar ${index}`} />
			</div>
			<div className="user-reviews__details">
				<p className="user-reviews__date">Review Date - {review.date}</p>
				<p className="user-reviews__text">{review.text}</p>
			</div>
			<div className="user-reviews__rating">
				{[...Array(review.rating)].map((_, i) => (
					<FaStar key={i} className="star" />
				))}
			</div>
		</div>
	)
}

export default UserReviewItem
