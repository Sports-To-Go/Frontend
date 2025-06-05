import React from 'react'
import './ActivityItem.scss'

interface ActivityItemProps {
	image: string
	title: string
	time: string
	description?: string
}

const ActivityItem: React.FC<ActivityItemProps> = ({ image, title, time }) => {
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
		</div>
	)
}

export default ActivityItem
