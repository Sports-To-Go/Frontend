import { NavLink } from 'react-router-dom'
import './NavTab.scss'

interface NavTabProps {
	icon: React.ReactNode
	text: string
	dest: string
}

const NavTab: React.FC<NavTabProps> = ({ icon, text, dest }) => {
	return (
		<NavLink
			to={dest}
			className={({ isActive }) =>
				isActive ? 'navtab active' : 'navtab'
			}
		>
			<div className="navtab-icon">{icon}</div>
			{text}
		</NavLink>
	)
}

export default NavTab
