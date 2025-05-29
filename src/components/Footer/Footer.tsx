import { useState } from 'react'
import './Footer.scss'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { Link } from 'react-router'

const Footer: React.FC = () => {
	const [collapsed, setCollapsed] = useState(true)

	const toggleCollapsed = () => {
		setCollapsed(!collapsed)
	}

	return (
		<footer className="footer">
			<div className={`footer-section ${collapsed ? 'collapsed' : ''}`}>
				<div className="footer-left">
					<div className="footer-2-column">
						<div>
							<b>Email</b>
						</div>
						<div>contact@sportstogo.com</div>
						<div>
							<b>Phone</b>
						</div>
						<div>0765 432 198</div>
					</div>
				</div>

				<div className="footer-center">
					{!collapsed && <FaChevronDown onClick={toggleCollapsed} cursor={'pointer'} />}
				</div>

				<div className="footer-right">
					<div className="footer-2-column">
						<div>Somewhere No. 42</div>
						<div>
							<b>Street</b>
						</div>
						<div>Iasi, Romania</div>
						<div>
							<b>City</b>
						</div>
					</div>
				</div>
			</div>
			<div className="footer-section">
				<div className="footer-left">
					<div>Sports-To-Go</div>
				</div>

				<div className="footer-center">
					{collapsed && <FaChevronUp onClick={toggleCollapsed} cursor={'pointer'} />}
				</div>

				<div className="footer-right">
					<div className="footer-section-links">
						<Link to="/faq">FAQ</Link>
						<a href="https://www.instagram.com/officialrickastley/">Instagram</a>
						<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">YouTube</a>
						<a href="https://www.tiktok.com/@rickastleyofficial?lang=en">TikTok</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
