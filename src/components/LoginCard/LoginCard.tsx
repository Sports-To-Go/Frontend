import { useState } from 'react'
import { CiLocationOn } from 'react-icons/ci'
import LoginForm from '../LoginForm/LoginForm'
import RegisterForm from '../RegisterForm/RegisterForm'
import OAuthButtons from '../OAuthButtons/OAuthButtons'
import './LoginCard.scss'

const ANIMATION_DURATION = 300

const LoginCard = () => {
	const [rotated, setRotated] = useState(false)
	const [isRegister, setIsRegister] = useState(false)

	const handleRotateToRegister = () => {
		setRotated(true)
		setTimeout(() => setIsRegister(true), ANIMATION_DURATION)
	}

	const handleRotateToLogin = () => {
		setRotated(false)
		setTimeout(() => setIsRegister(false), ANIMATION_DURATION)
	}

	return (
		<div
			className={`login-card ${rotated ? 'rotate' : ''} ${isRegister ? 'register-mode' : 'login-mode'}`}
		>
			<CiLocationOn size={60} color="#05c69d" style={{ marginBottom: '-30px' }} />
			<h1>{isRegister ? 'Register' : 'Log in'}</h1>

			{isRegister ? <RegisterForm /> : <LoginForm />}

			<div className="signup">
				{isRegister ? (
					<>
						Already have an account? <a onClick={handleRotateToLogin}>Sign in</a>
					</>
				) : (
					<>
						Don't have an account? <a onClick={handleRotateToRegister}>Sign up</a>
					</>
				)}
			</div>

			<div className="signup" style={{ marginTop: '10px' }}>
				<p>Or sign up using</p>
			</div>

			<OAuthButtons />
		</div>
	)
}

export default LoginCard
