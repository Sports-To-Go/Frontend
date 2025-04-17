import React, { useState, useRef, useEffect } from 'react'
import './Navbar.scss'
import Logo from '../Logo/Logo.tsx'
import NavTab from '../NavTab/NavTab.tsx'
import { GrHomeRounded, GrLanguage } from 'react-icons/gr'
import { FaRegSquarePlus } from 'react-icons/fa6'
import { CiUser, CiMap } from 'react-icons/ci'
import UserMenu from '../UserMenu/UserMenu'

interface NavbarProps {
	showTabs?: boolean
}

const Navbar: React.FC<NavbarProps> = ({ showTabs }) => {
	const [showMenu, setShowMenu] = useState(false)

	const menuRef = useRef<HTMLDivElement | null>(null)

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
			<div className="navbar-container">
				<Logo />
				{showTabs && (
					<div className="navbar-menu">
						<NavTab icon={<GrHomeRounded />} text="Find Locations" dest="/locations" />
						<NavTab
							icon={<FaRegSquarePlus />}
							text="Add Location"
							dest="/profile#locations"
						/>
						<NavTab icon={<CiMap />} text="See Groups" dest="/social" />
					</div>
				)}
				{showTabs && (
					<div className="navbar-right-container">
						<GrLanguage />

						<div className="navbar-profile-container" style={{ position: 'relative' }}>
							<div onClick={toggleMenu}>
								<CiUser style={{ fontSize: 32 }} />
							</div>
							{showMenu && <UserMenu menuRef={menuRef} />}
						</div>
					</div>
				)}
			</div>
		</nav>
	)
}

export default Navbar
