import React from 'react'
import './BugCard.scss'

interface bugInfoProps {
	title: string
	reportedBy: string
	description: string
	reportDate: Date
	id: number
}

const BugCard: React.FC<bugInfoProps> = ({ title, reportedBy, description, reportDate }) => {
	return (
		<div className="bug-card--info">
			<h2>{title}</h2>
			<p>{description}</p>
			<h4>{`Reported by: ${reportedBy} - ${reportDate}`}</h4>

			<button className="">Resolve</button>
		</div>
	)
}

export default BugCard
