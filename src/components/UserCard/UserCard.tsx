import { FC } from 'react'
import './UserCard.scss'
import { TiLocationArrowOutline } from 'react-icons/ti'
import { FaStar } from 'react-icons/fa'
import { useAuth } from '../../context/UserContext'

import placeholder from '../../assets/profilePhotoPlaceholder.png'

interface UserCardProps {
	description: string
}

const UserCard: FC<UserCardProps> = ({ description }) => {
	const { user } = useAuth()
	return (
		<div className="user-card">
			<div className="user-card__header">
				<div className="user-card__avatar">
					<img src={user?.photoURL ? user.photoURL : placeholder} alt="User avatar" />
				</div>

				<div className="user-card__info">
					{/* <h2 className="user-card__usertype">UserType</h2> */}
					<h1 className="user-card__name">{user?.displayName}</h1>
					<div className="user-card__rating">
						{[...Array(5)].map((_, i) => (
							<FaStar key={i} />
						))}
					</div>
				</div>
			</div>

			<div className="badge-toggle">
				<span className="toggle-label">{description}</span>
			</div>

			<div className="badge-iconic">
				<TiLocationArrowOutline className="icon" />
				<span className="badge-text">top 5% of event planners</span>
			</div>
		</div>
	)
}

export default UserCard
