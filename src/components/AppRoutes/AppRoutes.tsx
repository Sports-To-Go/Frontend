import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/UserContext'
import { useEmailVerification } from '../../context/EmailVerificationContext'

import Administration from '../../pages/Administration/Administration'
import AddLocationPage from '../../pages/AddLocation/AddLocationPage'
import Locations from '../../pages/Locations/Locations'
import Profile from '../../pages/Profile/Profile'
import Social from '../../pages/Social/Social'
import Login from '../../pages/Login/Login'
import ForgotPass from '../../pages/ForgotPass/ForgotPass'
import VerifyEmail from '../../pages/VerifyEmail/VerifyEmail'
import FAQPage from '../../pages/FAQ/FAQ'

const AppRoutes: React.FC = () => {
	const { user } = useAuth()
	const { showVerifyPage } = useEmailVerification()

	if (user === undefined) {
		return; // add waiting page here
	}

	const isLogged =
		!!user &&
		(user.emailVerified ||
			(user.providerData &&
				user.providerData.some((p: { providerId: string }) =>
					['facebook.com', 'github.com', 'google.com'].includes(p.providerId),
				)))

	const isAdmin = user?.isAdmin || false
	let routes: React.ReactNode = null

	if (isAdmin) {
		routes = (
			<>
				<Route path="/administration" element={<Administration />} />
				<Route path="/faq" element={<FAQPage />} />
				<Route path="*" element={<Navigate to="/administration" replace />} />
			</>
		)
	} else if (showVerifyPage) {
		routes = (
			<>
				<Route path="/verify-email" element={<VerifyEmail />} />
				<Route path="*" element={<Navigate to="/verify-email" replace />} />
			</>
		)
	} else {
		const loginRoute = (
			<Route
				path="/login"
				element={isLogged ? <Navigate to="/locations" replace /> : <Login />}
			/>
		)

		const forgotPassRoute = !isLogged && (
			<Route path="/forgot-password" element={<ForgotPass />} />
		)

		routes = isLogged ? (
			<>
				{loginRoute}
				{forgotPassRoute}
				<Route path="/locations" element={<Locations />} />
				<Route path="/social" element={<Social />} />
				<Route path="/profile/:uid" element={<Profile />} />
				<Route path="/add-location" element={<AddLocationPage />} />
				<Route path="/faq" element={<FAQPage />} />
				<Route path="*" element={<Navigate to="/locations" replace />} />
			</>
		) : (
			<>
				{loginRoute}
				{forgotPassRoute}
				<Route path="/locations" element={<Locations />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</>
		)
	}
	return <Routes>{routes}</Routes>
}

export default AppRoutes
