import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/UserContext'

import Administration from '../../pages/Administration/Administration'
import AddLocationPage from '../../pages/AddLocation/AddLocationPage'
import Locations from '../../pages/Locations/Locations'
import Profile from '../../pages/Profile/Profile'
import Social from '../../pages/Social/Social'
import Login from '../../pages/Login/Login'
import AdminError from '../../pages/AdminError/AdminError'

const AppRoutes: React.FC = () => {
	const { user } = useAuth()

	const isMobile = () => { return window.innerWidth < 800; }
	const isAdmin: boolean = false
	const isLogged: boolean = !!user

	const routes = isAdmin ? ( 
		isMobile() ? (
		<>
			<Route path="/administration-error" element={<AdminError />} />
			<Route path="*" element={<Navigate to="/administration-error" replace />} />
		</>

		) : (
		<>
			<Route path="/administration" element={<Administration />} />
			<Route path="*" element={<Navigate to="/administration" replace />} />
		</>
		)
	) : (
		<>
			<Route path="/social" element={isLogged ? <Social /> : <Navigate to="/login" replace />} />
			<Route
				path="/profile"
				element={isLogged ? <Profile /> : <Navigate to="/login" replace />}
			/>
			<Route
				path="/add-location"
				element={isLogged ? <AddLocationPage /> : <Navigate to="/login" replace />}
			/>

			{!isLogged && <Route path="/login" element={<Login />} />}

			<Route path="/locations" element={<Locations />} />
			<Route path="*" element={<Navigate to="/locations" replace />} />
		</>
	)

	return <Routes>{routes}</Routes>
}

export default AppRoutes
