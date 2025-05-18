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
    const { user, token, providerAccessToken } = await loginWithProvider(provider);

    let finalDisplayName = user.displayName;
    let finalPhotoURL = user.photoURL;

    if (provider === 'github' && providerAccessToken) {
      try {
        const githubResponse = await fetch('https://api.github.com/user', {
          headers: { 
            Authorization: `token ${providerAccessToken}`,
            Accept: 'application/vnd.github.v3+json'
          }
        });
        
        if (githubResponse.ok) {
          const githubData = await githubResponse.json();
          console.log('GitHub Data:', githubData);
          
          finalDisplayName = githubData.name || githubData.login;
          finalPhotoURL = githubData.avatar_url || user.photoURL;
        } else {
          console.warn('GitHub API response not OK:', await githubResponse.text());
        }
      } catch (githubError) {
        console.warn('Failed to fetch GitHub profile:', githubError);
        finalDisplayName = user.email?.split('@')[0] || 'GitHub User';
      }
    }

    const res = await fetch(`${BACKEND_URL}/users/profile`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`Backend auth failed: ${await res.text()}`);

		const userData = {
			uid: user.uid,
			email: user.email,
			displayName: finalDisplayName,
			photoURL: finalPhotoURL,
			createdAt: user.metadata.creationTime || '',
			lastLoginAt: user.metadata.lastSignInTime || '',
			emailVerified: user.emailVerified,
			providerData: user.providerData.map(p => ({
			providerId: p.providerId,
			uid: p.uid,
			displayName: p.displayName,
			email: p.email,
			photoURL: p.photoURL
	}))
};

    setUser(userData);
    navigate('/');
  } catch (err: unknown) {
    console.error('OAuth login error:', err);
    alert(`Login failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    await signOut(auth);
    unsetUser();
  }
};

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