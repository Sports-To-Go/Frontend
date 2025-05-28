import React from 'react'
import './ReportCardInfo.scss'

interface reportInfoProps {
	reportedBy: string
	description: string
	reportDate: string
}

const ReportCardInfo: React.FC<reportInfoProps> = ({ reportedBy, description, reportDate }) => {
	return (
		<div className="report-card--info">
			<p>{description}</p>
			<h4>{`Reported by: ${reportedBy} - ${reportDate}`}</h4>
		</div>
	)
}

export default ReportCardInfo
