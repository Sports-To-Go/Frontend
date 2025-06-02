import './OAuthButtons.scss'
import { loginWithProvider } from './OAuthProviders'
import { useAuth } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/firebase'
import { signOut, updateProfile } from 'firebase/auth'
import { BACKEND_URL } from '../../../integration-config'
import axios from 'axios'

const OAuthButtons = () => {
	const { setUser, unsetUser } = useAuth()
	const navigate = useNavigate()

	const handleOAuthLogin = async (provider: 'google' | 'facebook' | 'github') => {
		try {
			const { user, providerAccessToken } = await loginWithProvider(provider)

			let finalDisplayName = user.displayName || ''
			let finalPhotoURL = user.photoURL || ''

			// Handle GitHub special case
			if (provider === 'github' && providerAccessToken) {
				try {
					const githubResponse = await fetch('https://api.github.com/user', {
						headers: {
							Authorization: `token ${providerAccessToken}`,
							Accept: 'application/vnd.github.v3+json',
						},
					})

					if (githubResponse.ok) {
						const githubData = await githubResponse.json()
						finalDisplayName = githubData.name || githubData.login || finalDisplayName
						finalPhotoURL = githubData.avatar_url || finalPhotoURL

						await updateProfile(auth.currentUser!, {
							displayName: finalDisplayName,
							photoURL: finalPhotoURL,
						})
					}
				} catch (githubError) {
					console.warn('Failed to fetch GitHub profile:', githubError)
					finalDisplayName = user.email?.split('@')[0] || 'GitHub User'
				}
			}

			// Handle Facebook special case
			if (provider === 'facebook' && providerAccessToken && user.providerData.length) {
				const facebookProfile = user.providerData.find(p => p.providerId === 'facebook.com')
				if (facebookProfile) {
					const facebookUID = facebookProfile.uid
					finalPhotoURL = `https://graph.facebook.com/${facebookUID}/picture?type=large&access_token=${providerAccessToken}`

					await updateProfile(auth.currentUser!, {
						photoURL: finalPhotoURL,
					})
				}
			}

			// Prepare user data for context
			const userData = {
				uid: user.uid,
				email: user.email,
				displayName: finalDisplayName,
				photoURL: finalPhotoURL,
				createdAt: user.metadata.creationTime || '',
				lastLoginAt: user.metadata.lastSignInTime || '',
				emailVerified: true,
				providerData: user.providerData.map(p => ({
					providerId: p.providerId,
					uid: p.uid,
					displayName: p.displayName,
					email: p.email,
					photoURL: p.photoURL,
				})),
				isAdmin: false,
				description: '',
			}

			const jwtToken = await user.getIdToken(true)
			try {
				await axios.post(
					`http://${BACKEND_URL}/users/profile`,
					{},
					{
						headers: { Authorization: `Bearer ${jwtToken}` },
					},
				)
			} catch (createError) {
				console.error('Failed to create user in backend:', createError)
			}

			// Update context and navigate
			setUser(userData)
			navigate('/locations') // Adjust to your default route
		} catch (err: unknown) {
			console.error('OAuth login error:', err)
			alert(`Login failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
			await signOut(auth)
			unsetUser()
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
