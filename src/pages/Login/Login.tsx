import Layout from '../../components/Layout/Layout'
import LoginCard from '../../components/LoginCard/LoginCard'
import './Login.scss'

const Login = () => {
	return (
		<Layout showFooter={true} showTabs={false}>
			<div className="login-page">
				<LoginCard />
			</div>
		</Layout>
	)
}

export default Login
