import Layout from '../../components/Layout/Layout'
import './Social.scss'
import UpperMessagePreview from './UpperMessagePreview'
import LowerMessagePreview from './LowerMessagePreview'
import { FC } from 'react'
import GroupChat from '../../components/GroupChat/GroupChat'

const Social: FC = () => {

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

				<GroupChat groupID={1}/>
			</div>
		</Layout>
	)
}

export default Social
