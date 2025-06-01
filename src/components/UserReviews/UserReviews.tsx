import React from 'react'
import './UserReviews.scss'
import UserReviewItem from '../UserReviewsItem/UserReviewsItem'

const reviews = [
	{
		date: '12/04/2025',
		text: 'PersonalReview.LoremIpsum...',
		rating: 5,
	},
	{
		date: '10/04/2025',
		text: 'PersonalReview.LoremIpsum...',
		rating: 4,
	},
	{
		date: '08/04/2025',
		text: 'PersonalReview.LoremIpsum...',
		rating: 3,
	},
]

const UserReviews: React.FC = () => {
	return (
		<div className="user-reviews">
			<h2 className="user-reviews__title">User Reviews - by other users/venues -</h2>

			<div className="user-reviews__card">
				<p className="user-reviews__count">14 Reviews</p>
				<div className="user-reviews__scroll-container">
					{reviews.map((review, index) => (
						<UserReviewItem key={index} review={review} index={index} />
					))}
				</div>
			</div>
		</div>
	)
}

export default UserReviews
