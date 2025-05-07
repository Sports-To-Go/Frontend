import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/UserContext'

import Administration from '../../pages/Administration/Administration'
import AddLocationPage from '../../pages/AddLocation/AddLocationPage'
import Locations from '../../pages/Locations/Locations'
import Profile from '../../pages/Profile/Profile'
import Social from '../../pages/Social/Social'
import Login from '../../pages/Login/Login'
import { useEffect, useState } from 'react'
import { auth } from '../../firebase/firebase'
import { BACKEND_URL } from '../../../integration-config'
import axios from 'axios'

const AppRoutes: React.FC = () => {
	const { user } = useAuth()


	const [isAdmin, setIsAdmin] = useState(false)
	const [userDescription, setUserDescription] = useState('')
	const isLogged = !!user

	useEffect(() => {
		const fetchUserData = async () => {
			if (user === null) {
				setIsAdmin(false)
				setUserDescription('')
				return
			}

			try {
				const currentUser = auth.currentUser
				const token = await currentUser?.getIdToken()

				const response = await axios.get(`${BACKEND_URL}/users/profile`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				// console.log(response)

				setIsAdmin(response.data.admin)
				setUserDescription(response.data.description)
			} catch (error) {
				console.error('Error fetching user data:', error)
				setIsAdmin(false)
			}
		}

		fetchUserData()
	}, [user])

	const routes = isAdmin ? (
		<>
			<Route path="/administration" element={<Administration />} />
			<Route path="*" element={<Navigate to="/administration" replace />} />
		</>
	) : (
		<>
			<Route path="/social" element={isLogged ? <Social /> : <Navigate to="/login" replace />} />
			<Route
				path="/profile"
				element={
					isLogged ? (
						<Profile description={userDescription} />
					) : (
						<Navigate to="/login" replace />
					)
				}
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
