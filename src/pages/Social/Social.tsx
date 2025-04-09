import Layout from '../../components/Layout/Layout'
import './Social.scss'
import UpperMessagePreview from './UpperMessagePreview'
import LowerMessagePreview from './LowerMessagePreview'

const Social = () => {
	return (
		<Layout>
			<div className="social-container">
				{/* Left Sidebar */}
				<div className="social-left-container">
					<div className="message-preview-container">
						{/* Upper section: Tabs and search bar */}
						<UpperMessagePreview />
						{/* Lower section: Scrollable message list */}
						<LowerMessagePreview />
					</div>
				</div>

				{/* Right Section */}
				<div className="social-right-container">
					<div className="social-right-container"></div>
				</div>
			</div>
		</Layout>
	)
}

export default Social