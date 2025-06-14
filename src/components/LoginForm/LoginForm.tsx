import { useState } from 'react'
import { auth } from '../../firebase/firebase'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { RiEyeCloseFill, RiEyeFill } from 'react-icons/ri'
import { useResetPassword } from '../../context/ResetPasswordContext'
import { Link } from 'react-router-dom'
import './LoginForm.scss'

import { UserData, useAuth } from '../../context/UserContext'

const LoginForm = () => {
	const { setUser } = useAuth()
	const { allowAccess } = useResetPassword()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState('')
	const [resetPasswordEmailSent] = useState(false)
	const navigate = useNavigate()

	const togglePassword = () => setShowPassword(prev => !prev)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		if (!email || !password) {
			setError('Please enter your email and password.')
			return
		}

		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password)
			const firebaseUser = userCredential.user

			if (!firebaseUser.emailVerified) {
				await auth.signOut()
				setError(
					'Adresa de email nu este verificată. Verifică-ți emailul înainte de a te autentifica.',
				)
				return
			}

			const user: UserData = {
				uid: userCredential.user.uid,
				email: userCredential.user.email,
				displayName: userCredential.user.displayName,
				photoURL: userCredential.user.photoURL,
				createdAt: userCredential.user.metadata.creationTime || '',
				lastLoginAt: userCredential.user.metadata.lastSignInTime || '',
				emailVerified: userCredential.user.emailVerified,
			}

			setUser(user)
			navigate('/')
		} catch (err) {
			setError('Authentication failed. Please check your email and password.')
			console.error(err)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="email"
				placeholder="Email address"
				value={email}
				onChange={e => setEmail(e.target.value)}
			/>
			<div className="password-input-wrapper">
				<input
					type={showPassword ? 'text' : 'password'}
					placeholder="Password"
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<span onClick={togglePassword} className="eye-icon">
					{showPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
				</span>
			</div>

			<div className="options">
				<Link to="/forgot-password" onClick={allowAccess}>
					Forgot password?
				</Link>
			</div>

			<button type="submit">Log in</button>

			{error && <p className="error-message">{error}</p>}

			{resetPasswordEmailSent && (
				<p className="success-message">Password reset email sent! Please check your inbox.</p>
			)}
		</form>
	)
}

export default LoginForm
