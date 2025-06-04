import { Routes, Route, Navigate } from 'react-router'
import { useEmailVerification } from '../../context/EmailVerificationContext'
import { useAuth } from '../../context/UserContext'
import AddLocationPage from '../../pages/AddLocation/AddLocationPage'
import Administration from '../../pages/Administration/Administration'
import FAQPage from '../../pages/FAQ/FAQ'
import ForgotPass from '../../pages/ForgotPass/ForgotPass'
import Locations from '../../pages/Locations/Locations'
import Login from '../../pages/Login/Login'
import Profile from '../../pages/Profile/Profile'
import Social from '../../pages/Social/Social'
import VerifyEmail from '../../pages/VerifyEmail/VerifyEmail'
import Spinner from '../Spinner/Spinner'
import Layout from '../Layout/Layout'
import MyLocations from '../../pages/MyLocations/MyLocations'

const AppRoutes: React.FC = () => {
	const { user, loading } = useAuth()
	const { showVerifyPage } = useEmailVerification()

	if (loading) {
		return (
			<Layout>
				<Spinner />
			</Layout>
		)
	}

	if (!user) {
		return (
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/forgot-password" element={<ForgotPass />} />
				<Route path="/locations" element={<Locations />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		)
	}

	const isVerified =
		user.emailVerified ||
		user.providerData?.some(p =>
			['facebook.com', 'github.com', 'google.com'].includes(p.providerId),
		)

	if (!isVerified || showVerifyPage) {
		return (
			<Routes>
				<Route path="/verify-email" element={<VerifyEmail />} />
				<Route path="*" element={<Navigate to="/verify-email" replace />} />
			</Routes>
		)
	}

	if (user.isAdmin) {
		return (
			<Routes>
				<Route path="/administration" element={<Administration />} />
				<Route path="/faq" element={<FAQPage />} />
				<Route path="/profile/:uid" element={<Profile />} />
				<Route path="*" element={<Navigate to="/administration" replace />} />
			</Routes>
		)
	}

	return (
		<Routes>
			<Route path="/login" element={<Navigate to="/locations" replace />} />
			<Route path="/forgot-password" element={<ForgotPass />} />
			<Route path="/locations" element={<Locations />} />
			<Route path="/social" element={<Social />} />
			<Route path="/profile/:uid" element={<Profile />} />
			<Route path="/add-location" element={<AddLocationPage />} />
			<Route path="/faq" element={<FAQPage />} />
			<Route path="/locations/:uid" element={<MyLocations />} />
			<Route path="*" element={<Navigate to="/locations" replace />} />
		</Routes>
	)
}

export default AppRoutes
