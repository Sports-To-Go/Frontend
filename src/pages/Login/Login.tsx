import Layout from '../../components/Layout/Layout';
import { useState } from 'react';
import { CiLocationOn } from 'react-icons/ci';
import { RiEyeCloseFill, RiEyeFill } from 'react-icons/ri';
import { auth } from '../../firebase/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.scss';

const ANIMATION_DURATION = 300; // milliseconds

const Login = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [rotated, setRotated] = useState(false);
	const [isRegister, setIsRegister] = useState(false);
	const [username, setUsername] = useState('');
	const [rePassword, setRePassword] = useState('');
	const [error, setError] = useState('');

	const togglePassword = () => setShowPassword(prev => !prev);

	const handleOAuthLogin = (provider: string) => {
		console.log(`OAuth login with ${provider} clicked`);
		// Will implement Firebase OAuth logic here later
	};

	const handleLoginSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!email || !password) {
			setError('Please enter your email and password.');
			return;
		}

		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
			const idToken = await user.getIdToken();

			localStorage.setItem('authToken', idToken);

			console.log('User logged in:', user);
			console.log('ID Token:', idToken);

			navigate('/');
		} catch (err) {
			setError('Authentication failed. Please check your email and password.');
			console.error(err);
		}
	};

	const handleRegisterSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!username || !email || !password || !rePassword) {
			setError('All fields are required.');
			return;
		}

		if (password !== rePassword) {
			setError('Passwords do not match.');
			return;
		}

		console.log('Register user logic here (not implemented yet)');
	};

	const handleSubmit = (e: React.FormEvent) => {
		isRegister ? handleRegisterSubmit(e) : handleLoginSubmit(e);
	};

	const handleRotateToRegister = () => {
		setRotated(true);
		setTimeout(() => {
			setIsRegister(true);
			setShowPassword(true);
			resetForm();
		}, ANIMATION_DURATION);
	};

	const handleRotateToLogin = () => {
		setRotated(false);
		setTimeout(() => {
			setIsRegister(false);
			setShowPassword(false);
			resetForm();
		}, ANIMATION_DURATION);
	};

	const resetForm = () => {
		setEmail('');
		setPassword('');
		setUsername('');
		setRePassword('');
		setError('');
	};

	return (
		<Layout showFooter={true} showTabs={false}>
			<div className="login-page">
				<div className={`login-card ${rotated ? 'rotate' : ''} ${isRegister ? 'register-mode' : 'login-mode'}`}>
					<CiLocationOn size={60} color="#05c69d" style={{ marginBottom: '-30px' }} />
					<h1>{isRegister ? 'Register' : 'Log in'}</h1>
					<form onSubmit={handleSubmit}>
						{isRegister && (
							<input
								type="text"
								placeholder="Username"
								value={username}
								onChange={e => setUsername(e.target.value)}
							/>
						)}
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
							{isRegister && (
								<input
									className="repeat-password-input"
									type={showPassword ? 'text' : 'password'}
									placeholder="Repeat password"
									value={rePassword}
									onChange={e => setRePassword(e.target.value)}
								/>
							)}
							{!isRegister && <span onClick={togglePassword} className="eye-icon">
								{showPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
							</span>}
						</div>

						{!isRegister && (
							<div className="options">
								<Link to="/forgot-password">Forgot password?</Link>
							</div>
						)}

						<button type="submit">{isRegister ? 'Register' : 'Log in'}</button>

						{error && <p className="error-message">{error}</p>}

						<div className="signup">
							{isRegister ? (
								<>
									Already have an account?{' '}
									<a onClick={handleRotateToLogin}>
										Sign in
									</a>
								</>
							) : (
								<>
									Don't have an account?{' '}
									<a onClick={handleRotateToRegister}>
										Sign up
									</a>
								</>
							)}
						</div>

						<div className="signup" style={{ marginTop: '10px' }}>
							<p>Or sign up using</p>
						</div>

						<div className="social-icons">
							<div className="icon facebook" onClick={() => handleOAuthLogin('facebook')}>
								<i className="fab fa-facebook-f"></i>
							</div>
							<div className="icon twitter" onClick={() => handleOAuthLogin('twitter')}>
								<i className="fab fa-twitter"></i>
							</div>
							<div className="icon google" onClick={() => handleOAuthLogin('google')}>
								<i className="fab fa-google"></i>
							</div>
						</div>
					</form>
				</div>
			</div>
		</Layout>
	);
};

export default Login;
