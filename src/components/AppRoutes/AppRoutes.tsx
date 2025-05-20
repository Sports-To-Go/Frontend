import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/UserContext'

import Administration from '../../pages/Administration/Administration'
import AddLocationPage from '../../pages/AddLocation/AddLocationPage'
import Locations from '../../pages/Locations/Locations'
import Profile from '../../pages/Profile/Profile'
import Social from '../../pages/Social/Social'
import Login from '../../pages/Login/Login'

const AppRoutes: React.FC = () => {
	const { user } = useAuth()

	const isAdmin = false

	if (user === undefined) {
		return
	}

	const isLogged = !!user

	let routes: React.ReactNode = null

	if (isAdmin) {
		routes = (
			<>
				<Route path="/administration" element={<Administration />} />
				<Route path="*" element={<Navigate to="/administration" replace />} />
			</>
		)
	} else {
		const loginRoute = (
			<Route
				path="/login"
				element={isLogged ? <Navigate to="/locations" replace /> : <Login />}
			/>
		)

		routes = isLogged ? (
			<>
				{loginRoute}
				<Route path="/locations" element={<Locations />} />
				<Route path="/social" element={<Social />} />
				<Route path="/profile/:username" element={<Profile />} />
				<Route path="/add-location" element={<AddLocationPage />} />
				<Route path="*" element={<Navigate to="/locations" replace />} />
			</>
		) : (
			<>
				{loginRoute}
				<Route path="/locations" element={<Locations />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</>
		)
	}

	return <Routes>{routes}</Routes>
}

export default AppRoutes
