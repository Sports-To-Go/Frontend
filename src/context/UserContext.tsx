import { createContext, useContext, useState, ReactNode, useEffect, FC } from 'react'
import { auth } from '../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export interface UserData {
	uid: string
	email: string | null
	displayName: string | null
	photoURL: string | null
	createdAt: string
	lastLoginAt: string
}

interface AuthContextType {
	user: UserData | null | undefined
	setUser: (user: UserData | null) => void
	unsetUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<UserData | null | undefined>(undefined)

	const unsetUser = () => {
		setUser(null)
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
			if (firebaseUser) {
				// Restore user data from the authenticated Firebase user
				const restoredUser: UserData = {
					uid: firebaseUser.uid,
					email: firebaseUser.email,
					displayName: firebaseUser.displayName || null,
					photoURL: firebaseUser.photoURL || null,
					createdAt: firebaseUser.metadata.creationTime || '',
					lastLoginAt: firebaseUser.metadata.lastSignInTime || '',
				}
				setUser(restoredUser)
			} else {
				setUser(null)
			}
		})

		return () => unsubscribe()
	}, [])

	return (
		<AuthContext.Provider value={{ user, setUser, unsetUser }}>{children}</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
