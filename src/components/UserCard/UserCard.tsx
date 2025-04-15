import React, { useContext } from 'react'
import './UserCard.scss'
import { TiLocationArrowOutline } from 'react-icons/ti'
import { ThemeContext } from '../../context/ThemeContext'
import { FaStar } from 'react-icons/fa'

const UserCard: React.FC = () => {
	const { theme, toggleTheme } = useContext(ThemeContext)
	return (
		<div className="user-card">
			<div className="user-card__header">
				<div className="user-card__avatar">
					<img src="https://i.pravatar.cc/100" alt="User avatar" />
				</div>

				<div className="user-card__info">
					<h2 className="user-card__usertype">UserType</h2>
					<h1 className="user-card__name">Serban Robert-Stefan</h1>
					<div className="user-card__rating">
						{[...Array(5)].map((_, i) => (
							<FaStar key={i} />
						))}
					</div>
				</div>
			</div>

			<div className="badge-toggle">
				<label className="switch">
					<input type="checkbox" checked={theme == 'dark'} />
					<span className="slider" onClick={toggleTheme}></span>
				</label>
				<span className="toggle-label">night theme enjoyer</span>
			</div>

			<div className="badge-iconic">
				<TiLocationArrowOutline className="icon" />
				<span className="badge-text">top 5% of event planners</span>
			</div>
		</div>
	)
}

export default UserCard
