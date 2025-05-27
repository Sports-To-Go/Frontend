import React, { useState, useRef, useEffect } from 'react'
import './Navbar.scss'
import Logo from '../Logo/Logo.tsx'
import NavTab from '../NavTab/NavTab.tsx'
import { GrHomeRounded, GrLanguage } from 'react-icons/gr'
import { FaRegSquarePlus } from 'react-icons/fa6'
import { CiUser, CiMap } from 'react-icons/ci'
import UserMenu from '../UserMenu/UserMenu'
import { useNavigate } from 'react-router-dom'

interface NavbarProps {
	showTabs?: boolean
}

const Navbar: React.FC<NavbarProps> = ({ showTabs }) => {
	const [showMenu, setShowMenu] = useState(false)
	const menuRef = useRef<HTMLDivElement | null>(null)
	const navigate = useNavigate()

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setShowMenu(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const toggleMenu = () => setShowMenu(prev => !prev)

	if (showTabs == null) showTabs = true	

	return (
		<nav className="navbar">
			{/* Desktop Navbar */}
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
					<GrLanguage />
					<div className="navbar-profile-container" onClick={toggleMenu} style={{ position: 'relative' }}>
						<CiUser style={{ fontSize: 32 }} cursor="pointer" />
					</div>
				</div>
			</div>

			{/* Mobile Top Bar */}
			<div className="navbar-top-mobile">
				<Logo />
				<div className="navbar-profile-container" onClick={toggleMenu} style={{ position: 'relative' }}>
					<CiUser style={{ fontSize: 28 }} cursor="pointer" />
				</div>
			</div>

			{/* Mobile Bottom Bar */}
			<div className="navbar-bottom-mobile">
				<GrHomeRounded onClick={() => navigate('/locations')} />
				<FaRegSquarePlus onClick={() => navigate('/add-location')} />
				<CiMap onClick={() => navigate('/social')} />
			</div>

			{/* Single UserMenu instance */}
			{showMenu && (
				<div className="user-menu-wrapper" ref={menuRef}>
					<UserMenu menuRef={menuRef} />
				</div>
			)}
		</nav>
	)
}

export default Navbar
