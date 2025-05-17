import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth } from '../../firebase/firebase'

export const loginWithProvider = async (
  providerName: 'google' | 'facebook' | 'github'
) => {
  let provider
  switch (providerName) {
    case 'google':
      provider = new GoogleAuthProvider()
      break
    case 'facebook':
      provider = new FacebookAuthProvider()
      break
    case 'github':
      provider = new GithubAuthProvider()
      break
    default:
      throw new Error('Unsupported provider')
  }

  const result = await signInWithPopup(auth, provider)
  const token = await result.user.getIdToken()

  return {
    user: result.user,
    token,
  }
}