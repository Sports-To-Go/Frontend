import React from 'react'
import './BugCard.scss'
import { auth } from '../../firebase/firebase'
import axios from 'axios'
import { BACKEND_URL } from '../../../integration-config'

interface bugInfoProps {
	title: string
	reportedBy: string
	description: string
	reportedTime: Date
	id: number
	removeBug: (id: number) => void
}

const BugCard: React.FC<bugInfoProps> = ({
	title,
	reportedBy,
	description,
	reportedTime,
	id,
	removeBug,
}) => {
	const date = new Date(reportedTime).toISOString().split('T')[0]
	const resolveBug = async () => {
		const currentUser = auth.currentUser
		if (!currentUser) return

		try {
			const token = await currentUser.getIdToken(true)

			await axios.put(
				`http://${BACKEND_URL}/admin/bug/${id}/resolve`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			removeBug(id)
		} catch (error) {
			console.error('Error while resolving bug:', error)
		}
	}
	return (
		<div className="bug-card--info">
			<h2>{title}</h2>
			<p>{description}</p>
			<h4>{`Reported by: ${reportedBy} - ${date}`}</h4>

			<button className="" onClick={() => resolveBug()}>
				Resolve
			</button>
		</div>
	)
}

export default BugCard
