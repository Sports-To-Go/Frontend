import Layout from '../../components/Layout/Layout'
import './Social.scss'

import { RxHamburgerMenu } from 'react-icons/rx'

const Social = () => {
	return (
		<Layout>
			<div className="social-container">
				<div className="social-left-container"></div>
				<div className="social-right-container">
					<div className="social-chat-top">
						<div></div>
						<RxHamburgerMenu
							onClick={() => {
								alert('chat settings to be implemented')
							}}
						/>
					</div>
					<div className="social-chat-content"></div>
					<div className="social-chat-message-bar"></div>
				</div>
			</div>
		</Layout>
	)
}

export default Social
