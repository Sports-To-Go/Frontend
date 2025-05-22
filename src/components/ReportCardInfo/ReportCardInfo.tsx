import React from 'react'
import './ReportCardInfo.scss'

interface reportInfoProps {
	title: string
	reportedBy: string
	description: string
	reportDate: string
}

const ReportCardInfo: React.FC<reportInfoProps> = ({
	title,
	reportedBy,
	description,
	reportDate,
}) => {
	return (
		<div className="report-card--info">
			<h2>{title}</h2>
			<p>{description}</p>
			<h4>{`Reported by: ${reportedBy} - ${reportDate}`}</h4>
		</div>
	)
}

export default ReportCardInfo
