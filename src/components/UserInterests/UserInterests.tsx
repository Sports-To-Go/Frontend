import './UserInterests.scss'

const UserInterests = () => {
	return (
		<div className="user-interests-container">
			<div className="user-interests-header">User Interests</div>
			<div className="user-interests-content">
				<span className="interest-item">🎾 Football</span>
				<span className="interest-item">🏀 Basketball</span>
				<span className="interest-item">🏋️ Gym</span>
				<span className="interest-item">🧗 Climbing</span>
			</div>
		</div>
	)
}

export default UserInterests
