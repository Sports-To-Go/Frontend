import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Locations from './pages/Locations/Locations.tsx'
import Profile from './pages/Profile/Profile.tsx'
import Social from './pages/Social/Social.tsx'
import Login from './pages/Login/Login.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { Administration } from './pages/Administration/Administration.tsx'

/* 
  Locations should be split into two:
     user's locations (for creating a new location)
     all locations (for finding locations)
*/

const App: React.FC = () => {
	const isAdmin = true
	const isLogged = true
	const routes = isAdmin ? (
		<>
			<Route path="/administration" element={<Administration />} />
			<Route path="*" element={<Navigate to="/administration" replace />} />
		</>
	) : (
		<>
			<Route path="/login" element={<Login />} />
			{isLogged && <Route path="/social" element={<Social />} />}
			<Route path="/locations" element={<Locations />} />
			<Route path="/profile/:id" element={<Profile />} />
			{isLogged && <Route path="/profile" element={<Profile />} />}
			<Route path="*" element={<Navigate to="/locations" replace />} />
		</>
	)

	return (
		<ThemeProvider>
			<BrowserRouter>
				<Routes>{routes}</Routes>
			</BrowserRouter>
		</ThemeProvider>
	)
}

export default App
