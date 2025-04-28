import { useNavigate } from 'react-router'

import './Logo.scss'

const Logo: React.FC = () => {
	const navigate = useNavigate()

	return (
		<div className="logo" onClick={() => navigate('/')}>
			S
		</div>
	)
}

export default Logo
