import Navbar from '../Navbar/Navbar.tsx'
import Footer from '../Footer/Footer.tsx'
import './Layout.scss'

interface LayoutProps {
	children: React.ReactNode
	showTabs?: boolean
	showFooter?: boolean
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children, showTabs, showFooter }) => {
	return (
		<div className="layout">
			<Navbar showTabs={showTabs} />
			<main className="layout-content">{children}</main>
			{showFooter && <Footer />}
		</div>
	)
const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className="layout">
			<Navbar />
			<main className="layout-content">{children}</main>
			<Footer />
		</div>
	)
}

export default Layout
