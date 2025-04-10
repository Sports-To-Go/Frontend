import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Locations from './pages/Locations/Locations.tsx'
import Profile from './pages/Profile/Profile.tsx'
import Social from './pages/Social/Social.tsx'
import Login from './pages/Login/Login.tsx'

/* 
  Locations should be split into two:
     user's locations (for creating a new location)
     all locations (for finding locations)
*/

const App: React.FC = () => {
	const isAdmin = false
	const isLogged = true
	const routes = isAdmin ? (
		<>
			<Route path="/social" element={<Social />} />
			<Route path="/locations" element={<Locations />} />
			<Route path="/profile/:id" element={<Profile />} />
			<Route path="*" element={<Navigate to="/locations" replace />} />
		</>
	) : (
		<>
			<Route path="/login" element={<Login />} />
			{isLogged && <Route path="/social" element={<Social />} />}
			<Route path="/locations" element={<Locations />} />
			<Route path="/profile/:id" element={<Profile />} />
			{isLogged && <Route path="/profile#locations" element={<Profile />} />}
			<Route path="*" element={<Navigate to="/locations" replace />} />
		</>
	)

	return (
		<>
			<BrowserRouter>
				<Routes>{routes}</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
