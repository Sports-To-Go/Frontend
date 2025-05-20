import { ThemeContext } from '../../context/ThemeContext'
import { useAuth } from '../../context/UserContext'
import { useContext, FC, RefObject } from 'react'
import { FiUser, FiLogOut, FiLogIn } from 'react-icons/fi'
import { useNavigate } from 'react-router'
import { auth } from '../../firebase/firebase'
import { signOut } from 'firebase/auth'

import placeholder from '../../assets/profilePhotoPlaceholder.png'

import './UserMenu.scss'

interface UserMenuProps {
	menuRef: RefObject<HTMLDivElement | null>
}

const UserMenu: FC<UserMenuProps> = ({ menuRef }) => {
	const { theme, toggleTheme } = useContext(ThemeContext)
	const navigate = useNavigate()

	const { unsetUser, user } = useAuth()

	const handleLogout = async () => {
		try {
			await signOut(auth)
			unsetUser()

			navigate('/')
		} catch (error) {
			console.error('Error on logout:', error)
		}
	}

	return (
		<div className="user-menu" ref={menuRef}>
			<div className="user-menu__header">
				<img
					src={user && user.photoURL ? user.photoURL : placeholder}
					alt="User avatar"
					className="user-menu__avatar"
				/>
				<div className="user-menu__info">
					<span className="user-menu__name">{user ? user.displayName : 'Guest'}</span>
				</div>
			</div>

			<hr className="user-menu__divider" />

			<div className="user-menu__item user-menu__theme-toggle">
				<label className="switch">
					<input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
					<span className="slider"></span>
				</label>
				<span className="toggle-label">Toggle theme</span>
			</div>
			{!!user ? (
				<>
					<div
						className="user-menu__item"
						onClick={() => navigate(`/profile/${user?.displayName || ''}`)}
					>
						<FiUser style={{ marginRight: '8px' }} />
						Profile
					</div>

					<div className="user-menu__item" onClick={handleLogout}>
						<FiLogOut style={{ marginRight: '8px' }} />
						Disconnect
					</div>
				</>
			) : (
				<div className="user-menu__item" onClick={() => navigate('/login')}>
					<FiLogIn style={{ marginRight: '8px' }} />
					Sign In
				</div>
			)}
		</div>
	)
}

export default UserMenu
