import { useState, useEffect, FC } from 'react'
import './UserCard.scss'
import { TiLocationArrowOutline } from 'react-icons/ti'
import { FaStar } from 'react-icons/fa'
import { useAuth } from '../../context/UserContext'

import placeholder from '../../assets/profilePhotoPlaceholder.png'

import axios from 'axios'
import { auth } from '../../firebase/firebase'

const UserCard: FC = () => {
	const { user } = useAuth()

	const [description, setDescription] = useState<string>('')

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const currentUser = auth.currentUser
				const token = await currentUser?.getIdToken()

				const response = await axios.get('http://localhost:8081/users/private', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				setDescription(response.data.description)
			} catch (error) {
				console.error('Error fetching user description:', error)
			}
		}

		fetchUserData()
	}, [user])

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
