import Layout from '../../components/Layout/Layout'
import { useState } from 'react'
import { CiLocationOn } from 'react-icons/ci'
import { RiEyeCloseFill, RiEyeFill } from 'react-icons/ri'
import './Login.scss'

const Login = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [rotated, setRotated] = useState(false)
	const [isRegister, setIsRegister] = useState(false)
	const [registerUsername, setRegisterUsername] = useState('')
	const [rePassword, setRePassword] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log('Username:', username)
		console.log('Password:', password)
	}

	const togglePassword = () => {
		setShowPassword(prev => !prev)
	}

	const handleRotateToRegister = () => {
		setRotated(true)
		setTimeout(() => {
			setIsRegister(true)
			setShowPassword(true)
			setUsername('')
			setPassword('')
			setRePassword('')
			setRegisterUsername('')
		}, 300)
	}

	const handleRotateToLogin = () => {
		setRotated(false)
		setTimeout(() => {
			setIsRegister(false)
			setShowPassword(false)
			setUsername('')
			setPassword('')
			setRePassword('')
			setRegisterUsername('')
		}, 300)
	}

	return (
		<Layout showFooter={true} showTabs={false}>
			<div className="login-page">
			<div className={`login-card ${rotated ? 'rotate' : ''} ${isRegister ? 'register-mode' : 'login-mode'}`}>
					<CiLocationOn size={60} color="#05c69d" style={{ marginBottom: '-30px' }} />
					<h1>{isRegister ? 'Register' : 'Log in'}</h1>
					<form onSubmit={handleSubmit}>
						{isRegister && (
							<>
								<input
									type="text"
									placeholder="Username"
									value={registerUsername}
									onChange={e => setRegisterUsername(e.target.value)}
								/>
							</>
						)}
						<input
							type="email"
							placeholder="Email address"
							value={username}
							onChange={e => setUsername(e.target.value)}
						/>
						<div className="password-input-wrapper">
							<input
								type={showPassword ? 'text' : 'password'}
								placeholder="Password"
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
							{isRegister && (
								<input
									className="repeat-password-input"
									type={showPassword ? 'text' : 'password'}
									placeholder="Repeat Password"
									value={rePassword}
									onChange={e => setRePassword(e.target.value)}
								/>
							)}
							{!isRegister && (
								<span onClick={togglePassword} className="eye-icon">
									{showPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
								</span>
							)}
						</div>
						{!isRegister && (
							<div className="options">
								<a href="#">Forgot password?</a>
							</div>
						)}
						<button type="submit">{isRegister ? 'Register' : 'Log in'}</button>
						<div className="signup">
							{isRegister ? (
								<>
									Already have an account?{' '}
									<a href="#" onClick={handleRotateToLogin}>
										Sign in
									</a>
								</>
							) : (
								<>
									Don't have an account?{' '}
									<a href="#" onClick={handleRotateToRegister}>
										Sign up
									</a>
								</>
							)}
						</div>
						<div className="signup">
							<a href="#">Or Sign Up Using </a>
						</div>
						<div className="social-icons">
							<div className="icon facebook">
								<i className="fab fa-facebook-f"></i>
							</div>
							<div className="icon twitter">
								<i className="fab fa-twitter"></i>
							</div>
							<div className="icon google">
								<i className="fab fa-google"></i>
							</div>
						</div>
					</form>
				</div>
			</div>
		</Layout>
	)
}

export default Login
