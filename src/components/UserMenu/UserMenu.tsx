import React, { useContext } from 'react'
import './UserMenu.scss'
import { ThemeContext } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase/firebase'
import { FiUser } from 'react-icons/fi'
import { FiLogOut } from 'react-icons/fi'

interface UserMenuProps {
	menuRef: React.RefObject<HTMLDivElement | null>
}

const UserMenu: React.FC<UserMenuProps> = ({ menuRef }) => {
	const { theme, toggleTheme } = useContext(ThemeContext)
	const navigate = useNavigate()

	const handleLogout = async () => {
		try {
			await signOut(auth);
			localStorage.removeItem('authToken'); // sau sessionStorage.removeItem(...)
			navigate('/login');
		} catch (error) {
			console.error('Eroare la deconectare:', error);
		}
	};

	return (
		<div className="user-menu" ref={menuRef}>
			<div className="user-menu__header">
				<img src="https://i.pravatar.cc/100" alt="User avatar" className="user-menu__avatar" />
				<div className="user-menu__info">
					<span className="user-menu__name">Serban Robert-Stefan</span>
				</div>
			</div>

			<hr className="user-menu__divider" />

			<div className="user-menu__item user-menu__theme-toggle">
				<label className="switch">
					<input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
					<span className="slider"></span>
				</label>
				<span className="toggle-label">night theme enjoyer</span>
			</div>

			<div className="user-menu__item" onClick={() => navigate('/profile')}>
				<FiUser style={{ marginRight: '8px' }} />
				Profile
			</div>
			<div className="user-menu__item" onClick={handleLogout}>
				<FiLogOut style={{ marginRight: '8px' }} />
				Disconnect
			</div>
		</div>
	)
}

export default UserMenu
