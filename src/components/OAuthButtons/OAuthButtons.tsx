import './OAuthButtons.scss'

const OAuthButtons = () => {
	const handleOAuthLogin = (provider: string) => {
		console.log(`OAuth login with ${provider} clicked`)
	}

	return (
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
	)
}

export default OAuthButtons
