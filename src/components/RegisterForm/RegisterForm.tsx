import { useState } from 'react'
import './RegisterForm.scss'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../firebase/firebase'
import { useNavigate } from 'react-router'
import { sendEmailVerification } from 'firebase/auth';
import { useEmailVerification } from '../../context/EmailVerificationContext';
import axios from 'axios'

import { BACKEND_URL } from "../../../integration-config.ts"

const RegisterForm = () => {
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [rePassword, setRePassword] = useState('')
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const { setShowVerifyPage } = useEmailVerification();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		if (!username || !email || !password || !rePassword) {
			setError('All fields are required.')
			return
		}

		if (password !== rePassword) {
			setError('Passwords do not match.')
			return
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password)
			await updateProfile(userCredential.user, {
				displayName: username,
			})

			await sendEmailVerification(userCredential.user);

			const currentUser = auth.currentUser

			const token = await currentUser?.getIdToken()
			await axios.post(
				`http://${BACKEND_URL}/users/profile`,
				{}, // Pass an empty object for the request body if no data needs to be sent
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)

			setShowVerifyPage(true)
			navigate('/verify-email')
		} catch (err: any) {
			if (err.code === 'auth/email-already-in-use') {
				setError('This email is already in use. Please try another one.')
			} else if (err.code === 'auth/weak-password') {
				setError('Password should be at least 6 characters.')
			} else {
				setError('Registration failed. Please try again.')
			}
			console.error('Error during registration:', err.message)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<input
				type="email"
				placeholder="Email address"
				value={email}
				onChange={e => setEmail(e.target.value)}	
			/>
			<input
				type="password"
				placeholder="Password"	
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Repeat password"
				value={rePassword}
				onChange={e => setRePassword(e.target.value)}
			/>
			<button type="submit">Register</button>

			{error && <p className="error-message">{error}</p>}
		</form>
	)
}

export default RegisterForm
