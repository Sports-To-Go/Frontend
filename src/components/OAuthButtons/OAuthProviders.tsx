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
    let provider;
    switch (providerName) {
      case 'google':
        provider = new GoogleAuthProvider();
        break;
      case 'facebook':
        provider = new FacebookAuthProvider();
        break;
      case 'github':
        provider = new GithubAuthProvider();
        provider.addScope('read:user');
        provider.addScope('user:email');
        break;
      default:
        throw new Error('Unsupported provider');
    }

    const result = await signInWithPopup(auth, provider);
    
    let githubAccessToken: string | undefined;
    if (providerName === 'github') {
      const credential = GithubAuthProvider.credentialFromResult(result);
      githubAccessToken = credential?.accessToken;
    }

    let facebookAccessToken: string | undefined;
    if (providerName === 'facebook') {
      const credential = FacebookAuthProvider.credentialFromResult(result);
      facebookAccessToken = credential?.accessToken;
    } 


    const token = await result.user.getIdToken();

    return {
      user: result.user,
      token,
      providerAccessToken: githubAccessToken || facebookAccessToken
    };
  };
