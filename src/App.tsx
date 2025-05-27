import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.tsx'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/UserContext.tsx'
import { ResetPasswordProvider } from './context/ResetPasswordContext.tsx';
import { EmailVerificationProvider } from './context/EmailVerificationContext';

import AppRoutes from './components/AppRoutes/AppRoutes.tsx';

const App: React.FC = () => {

	return (
		<EmailVerificationProvider>
				<ResetPasswordProvider>
							<AuthProvider>
								<ThemeProvider>
									<BrowserRouter>
										<AppRoutes />
										<ToastContainer position="top-center" autoClose={3000} />
									</BrowserRouter>
								</ThemeProvider>
							</AuthProvider>
				</ResetPasswordProvider>
		</EmailVerificationProvider>
	)
}

export default App
