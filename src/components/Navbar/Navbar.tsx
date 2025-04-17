import './Navbar.scss'
import Logo from '../Logo/Logo.tsx'
import NavTab from '../NavTab/NavTab.tsx'
import { GrHomeRounded, GrLanguage } from 'react-icons/gr'
import { FaRegSquarePlus } from 'react-icons/fa6'
import { CiUser, CiMap } from 'react-icons/ci'
import { NavLink } from 'react-router-dom'

interface NavbarProps {
	showTabs?: boolean
}

const Navbar: React.FC<NavbarProps> = ({ showTabs }) => {
	if (showTabs == null) showTabs = true
	return (
		<nav className="navbar">
			<div className="navbar-container">
				<Logo />
				{showTabs && (
					<div className="navbar-menu">
						<NavTab icon={<GrHomeRounded />} text="Find Locations" dest="/locations" />
						<NavTab icon={<FaRegSquarePlus />} text="Add Location" dest="/add-location" />
						<NavTab icon={<CiMap />} text="See Groups" dest="/social" />
					</div>
				)}
				<div className="navbar-right-container">
					{/* Language changes to be implemented */}
					<GrLanguage />

					{/* This should actually open a modal with some option and a way to change the switch between dark and light mode*/}
					<NavLink to="/profile" className="navbar-profile-container">
						{/* <CiMenuBurger style={{ fontSize: 24 }} /> */}
						<CiUser style={{ fontSize: 32 }} />
					</NavLink>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
