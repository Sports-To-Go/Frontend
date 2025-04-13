import Layout from '../../components/Layout/Layout'
import { useState } from 'react'
import { CiLocationOn } from 'react-icons/ci'
import { RiEyeCloseFill, RiEyeFill } from 'react-icons/ri'
import './Login.scss'

const Login = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log('Username:', username)
		console.log('Password:', password)
	}

	const togglePassword = () => {
		setShowPassword(prev => !prev)
	}

	return (
		<Layout showFooter={true} showTabs={false}>
			<div className="login-page">
				<div className="login-card">
					<CiLocationOn size={60} color="#05c69d" style={{ marginBottom: '-30px' }} />
					<h1>Log in</h1>
					<form onSubmit={handleSubmit}>
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
							<span onClick={togglePassword} className="eye-icon">
								{showPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
							</span>
						</div>
						<div className="options">
							<a href="#">Forgot password?</a>
						</div>
						<button type="submit">Log in</button>
						<div className="signup">
							Don't have an account? <a href="#">Sign up</a>
						</div>
						<div className="signup">
							{' '}
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
