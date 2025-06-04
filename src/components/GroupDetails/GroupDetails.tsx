import { FC, useState } from 'react'
import './GroupDetails.scss'
import { useSocial } from '../../context/SocialContext'
import Spinner from '../Spinner/Spinner'

interface GroupDetailsProps {
	image: string
	name: string
	description: string
	members: number
	groupID: number
	onBack: () => void
}

const GroupDetails: FC<GroupDetailsProps> = ({
	image,
	name,
	description,
	members,
	groupID,
	onBack,
}) => {
	const { joinGroup, removeRecommendation } = useSocial()
	const [status, setStatus] = useState<'' | 'ok' | 'error' | 'loading'>('')

	const handleJoin = async () => {
		setStatus('loading')
		const responseStatus = await joinGroup(groupID)
		setStatus(responseStatus ? 'ok' : 'error')
		setTimeout(() => {
			onBack()
			removeRecommendation(groupID)
		}, 2000)
	}

	return (
		<div className="group-details">
			<button className="back-button" onClick={onBack}>
				Back
			</button>

			<div className="group-header">
				<img
					src={image || 'https://dashboard.codeparrot.ai/api/image/Z_T76IDi91IKZZrg/image.png'}
					alt={`${name}'s avatar`}
					className="group-image"
				/>
			</div>

			<div className="group-description-section">
				<h2>Description</h2>
				<p>{description}</p>
			</div>

			<div className="group-members-section">
				<h2>Members</h2>
				<p>{members} members</p>
			</div>

			{/*Apply button*/}
			<div className="modal-button-container">
				<button className="modal-button" onClick={handleJoin}>
					{status === '' ? (
						<>Apply</>
					) : status === 'ok' ? (
						<>Applied</>
					) : status === 'error' ? (
						<>Error</>
					) : (
						<Spinner />
					)}
				</button>
			</div>
		</div>
	)
}

export default GroupDetails
