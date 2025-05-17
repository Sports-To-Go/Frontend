import './OAuthButtons.scss'
import { loginWithProvider } from './OAuthProviders'
import { useAuth } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../../../integration-config'

const OAuthButtons = () => {
	const { setUser } = useAuth()
	const navigate = useNavigate()

	const handleOAuthLogin = async (
		provider: 'google' | 'facebook' | 'github'
	) => {
		try {
			const { user, token } = await loginWithProvider(provider)

			const res = await fetch(`${BACKEND_URL}/users/profile`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			})

			if (!res.ok) throw new Error('Backend auth failed')

			await res.json()
			setUser({
				uid: user.uid,
				email: user.email,
				displayName: user.displayName,
				photoURL: user.photoURL,
				createdAt: user.metadata.creationTime || '',
				lastLoginAt: user.metadata.lastSignInTime || '',
				emailVerified: user.emailVerified,
			})

			navigate('/')
		} catch (err) {
			console.error(err)
			alert('Login failed')
		}
	}

	return (
		<div className="social-icons">
			<div className="icon facebook" onClick={() => handleOAuthLogin('facebook')}>
				<i className="fab fa-facebook-f"></i>
			</div>
			<div className="icon google" onClick={() => handleOAuthLogin('google')}>
				<i className="fab fa-google"></i>
			</div>
			<div className="icon github" onClick={() => handleOAuthLogin('github')}>
				<i className="fab fa-github"></i>
			</div>
		</div>
	)
}

export default OAuthButtons