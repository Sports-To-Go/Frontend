import './OAuthButtons.scss'
import { loginWithProvider } from './OAuthProviders'
import { useAuth } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../../../integration-config'
import { auth } from '../../firebase/firebase'
import { signOut } from 'firebase/auth'

const OAuthButtons = () => {
  const { setUser, unsetUser } = useAuth()
  const navigate = useNavigate()

  const handleOAuthLogin = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      const { user, token } = await loginWithProvider(provider)
      
      const res = await fetch(`${BACKEND_URL}/users/profile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error(`Backend auth failed with status ${res.status}`)
      }

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: user.metadata.creationTime || '',
        lastLoginAt: user.metadata.lastSignInTime || '',
        emailVerified: user.emailVerified,
        providerData: user.providerData
      }

      setUser(userData)
      navigate('/')
    } catch (err: unknown) {
      let errorMessage = 'Login failed'
      if (err instanceof Error) {
        errorMessage = err.message
      }
      console.error('OAuth login error:', err)
      alert(`Login failed: ${errorMessage}`)
      // Deloghează utilizatorul dacă ceva nu a funcționat
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