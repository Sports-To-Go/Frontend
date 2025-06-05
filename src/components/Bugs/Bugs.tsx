import React, { useEffect, useState } from 'react'
import BugCard from '../BugCard/BugCard'
import './Bugs.scss'
import { auth } from '../../firebase/firebase'
import axios from 'axios'
import { BACKEND_URL } from '../../../integration-config'
import NoData from '../NoData/NoData'

interface BugInfoProps {
	title: string
	reportedBy: string
	description: string
	reportedTime: Date
	id: number
}

const Bugs: React.FC = () => {
	const [bugs, setBugs] = useState<BugInfoProps[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const removeBug = (id: number) => {
		setBugs(bugs.filter(bug => bug.id !== id))
	}

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
			} finally {
				setIsLoading(false)
			}
		}

		fetchBugs()
	}, [])

	if (isLoading)
		return (
			<div className="bugs-container--loading">
				<div className="circle"></div>
			</div>
		)

	return (
		<div className="bugs-container">
			{!!bugs ? (
				bugs.map(bug => (
					<BugCard
						key={bug.id}
						id={bug.id}
						title={bug.title}
						reportedTime={bug.reportedTime}
						reportedBy={bug.reportedBy}
						description={bug.description}
						removeBug={removeBug}
					/>
				))
			) : (
				<NoData>No bugs reported</NoData>
			)}
		</div>
	)
}

export default Bugs
