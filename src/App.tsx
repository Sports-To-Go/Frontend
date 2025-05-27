import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.tsx'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/UserContext.tsx'

import AppRoutes from './components/AppRoutes/AppRoutes.tsx'
import { SocialProvider } from './context/SocialContext.tsx'

const App: React.FC = () => {
	return (
		<AuthProvider>
			<ThemeProvider>
				<SocialProvider>
					<BrowserRouter>
						<AppRoutes />
						<ToastContainer position="top-center" autoClose={3000} />
					</BrowserRouter>
				</SocialProvider>
			</ThemeProvider>
		</AuthProvider>
	)
}

export default App
