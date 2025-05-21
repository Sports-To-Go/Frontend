import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
	type FC,
} from 'react'
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
	description?: string
	isAdmin?: boolean
}

interface AuthContextType {
	user: UserData | null
	setUser: (user: UserData | null) => void
	unsetUser: () => void
	loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<UserData | null>(null)
	const [loading, setLoading] = useState(true)

	const unsetUser = () => setUser(null)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
			if (firebaseUser) {
				try {
					const token = await firebaseUser.getIdToken()

					const response = await axios.get(`${BACKEND_URL}/users/profile`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					})

					const backendData = response.data

					const restoredUser: UserData = {
						uid: firebaseUser.uid,
						email: firebaseUser.email,
						displayName: firebaseUser.displayName || null,
						photoURL: firebaseUser.photoURL || null,
						createdAt: firebaseUser.metadata.creationTime || '',
						lastLoginAt: firebaseUser.metadata.lastSignInTime || '',
						description: backendData.description,
						isAdmin: backendData.is_admin,
					}

					setUser(restoredUser)
				} catch (error) {
					console.error('Failed to fetch backend user data:', error)
					setUser(null)
				}
			} else {
				setUser(null)
			}
			setLoading(false)
		})

		return () => unsubscribe()
	}, [])

	return (
		<AuthContext.Provider value={{ user, setUser, unsetUser, loading }}>
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
