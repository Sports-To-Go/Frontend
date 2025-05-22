import React, { useEffect, useState } from 'react'
import BugCard from '../BugCard/BugCard'
import './Bugs.scss'
import { auth } from '../../firebase/firebase'
import axios from 'axios'
import { BACKEND_URL } from '../../../integration-config'

interface BugInfoProps {
	title: string
	reportedBy: string
	description: string
	reportDate: Date
	id: number
}

const Bugs: React.FC = () => {
	const [bugs, setBugs] = useState<BugInfoProps[]>([])

	useEffect(() => {
		const fetchBugs = async () => {
			const currentUser = auth.currentUser
			if (!currentUser) return

			try {
				const token = await currentUser.getIdToken(true)

				const response = await axios.get(`http://${BACKEND_URL}/admin/bug/getAll`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				setBugs(response.data)
			} catch (error) {
				console.error('Error fetching bugs:', error)
			}
		}

		fetchBugs()
	}, [])

	return (
		<div className="bugs-container">
			{!!bugs ? (
				bugs.map(bug => (
					<BugCard
						key={bug.id}
						id={bug.id}
						title={bug.title}
						reportDate={bug.reportDate}
						reportedBy={bug.reportedBy}
						description={bug.description}
					/>
				))
			) : (
				<div>No bugs..</div>
			)}
		</div>
	)
}

export default Bugs
