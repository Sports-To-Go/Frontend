import { createContext, useContext, useState, useEffect, type ReactNode, type FC } from 'react'
import { auth } from '../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import axios from 'axios'
import { BACKEND_URL } from '../../integration-config'

export interface UserData {
	uid: string
	email: string | null
	displayName: string | null
	photoURL: string | null
	createdAt: string
	lastLoginAt: string
	emailVerified: boolean
	description?: string
	isAdmin?: boolean
	providerData?: Array<{
		providerId: string
		uid: string
		displayName: string | null
		email: string | null
		photoURL: string | null
	}>
}

interface AuthContextType {
	user: UserData | null
	setUser: (user: UserData | null) => void
	unsetUser: () => void
	loading: boolean
	backendLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<UserData | null>(null)
	const [loading, setLoading] = useState(true)
	const [backendLoading, setBackendLoading] = useState(false)

	const unsetUser = () => setUser(null)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
			if (firebaseUser) {
				const isVerified =
					firebaseUser.emailVerified ||
					firebaseUser.providerData.some(p =>
						['facebook.com', 'github.com', 'google.com'].includes(p.providerId),
					)

				if (!isVerified) {
					setUser(null)
					setLoading(false)
					return
				}

				// Create base user from Firebase data
				const baseUser: UserData = {
					uid: firebaseUser.uid,
					email: firebaseUser.email,
					displayName: firebaseUser.displayName,
					photoURL: firebaseUser.photoURL,
					createdAt: firebaseUser.metadata.creationTime || '',
					lastLoginAt: firebaseUser.metadata.lastSignInTime || '',
					emailVerified: firebaseUser.emailVerified,
					providerData: firebaseUser.providerData.map(p => ({
						providerId: p.providerId,
						uid: p.uid,
						displayName: p.displayName,
						email: p.email,
						photoURL: p.photoURL,
					})),
					isAdmin: false,
					description: '',
				}

				try {
					const token = await firebaseUser.getIdToken()
					setBackendLoading(true)

					try {
						// First try to get user from backend
						const response = await axios.get(`http://${BACKEND_URL}/users/profile`, {
							headers: { Authorization: `Bearer ${token}` },
						})

						// Merge backend data with Firebase data
						setUser({
							...baseUser,
							description: response.data.description || '',
							isAdmin: response.data.admin || false,
						})
					} catch (error) {
						if (axios.isAxiosError(error) && error.response?.status === 404) {
							// If user doesn't exist in backend, use Firebase data temporarily
							console.log('User not found in backend, using Firebase data')
							setUser(baseUser)

							// Optionally: Try to create user in backend
							try {
								await axios.post(
									`http://${BACKEND_URL}/users/profile`,
									{},
									{
										headers: { Authorization: `Bearer ${token}` },
									},
								)
							} catch (createError) {
								console.error('Failed to create user in backend:', createError)
							}
						} else {
							console.warn('Error fetching user data:', error)
							setUser(baseUser)
						}
					}
				} catch (error) {
					console.error('Error during authentication:', error)
					setUser(baseUser)
				} finally {
					setBackendLoading(false)
					setLoading(false)
				}
			} else {
				// No user signed in
				setUser(null)
				setLoading(false)
			}
		})

		return () => unsubscribe()
	}, [])

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				unsetUser,
				loading: loading || backendLoading,
				backendLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
