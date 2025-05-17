import './UserBio.scss'
interface Props {
	description: string
}

const UserBio = ({ description }: Props) => {
	return (
		<div className="user-bio-container">
			<div className="user-bio-header">User Description</div>
			<div className="user-bio-content">{description || 'No description provided.'}</div>
		</div>
	)
}

export default UserBio
