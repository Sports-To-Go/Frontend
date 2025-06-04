import NoData from '../NoData/NoData'
import './UserInterests.scss'
interface Props {
	interests: string[]
}

const UserInterests = ({ interests }: Props) => {
	return (
		<div className="user-interests-container">
			<div className="user-interests-header">User Interests</div>
			<div className="user-interests-content">
				{interests.length > 0 ? (
					interests.map((interest, idx) => (
						<span key={idx} className="interest-item">
							{interest}
						</span>
					))
				) : (
					<NoData>No interests found</NoData>
				)}
			</div>
		</div>
	)
}

export default UserInterests
