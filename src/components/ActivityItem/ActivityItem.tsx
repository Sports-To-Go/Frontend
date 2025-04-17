import React from 'react'
import './ActivityItem.scss'
import { FaStar } from 'react-icons/fa'

interface ActivityItemProps {
	image: string
	title: string
	time: string
	description?: string
	rating?: number
}

const ActivityItem: React.FC<ActivityItemProps> = ({ image, title, time, rating }) => {
	return (
		<div className="activity-item">
			<div className="activity-item__left">
				<div className="activity-item__image-container">
					<img src={image} alt="activity" />
				</div>

				<div className="activity-item__main">
					<p className="activity-item__title">{title}</p>
					<p className="activity-item__time">{time}</p>
				</div>
			</div>

			{/* separator */}
			<div className="activity-item__divider"></div>

			<div className="activity-item__review">
				<p className="activity-item__text">
					PersonalReview.LoremIpsumPersonalReviewLoremIpsum...
				</p>
				<div className="activity-item__rating">
					{[...Array(rating)].map((_, i) => (
						<FaStar key={i} className="star" />
					))}
				</div>
			</div>
		</div>
	)
}

export default ActivityItem
