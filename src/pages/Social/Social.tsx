import React, { useState } from 'react'
import DisplayPhoto from '../../components/DisplayPhoto/DisplayPhoto'
import Layout from '../../components/Layout/Layout'
import './Social.scss'
import { CiSettings } from 'react-icons/ci'
import UpperMessagePreview from './UpperMessagePreview'
import LowerMessagePreview from './LowerMessagePreview'
import GroupSettingsModal from './GroupSettingsModal'

class Message {
	imageURL: string = ''
	content: string = ''
}

const Social: React.FC = () => {
	const [isGroupSettingsOpen, setIsGroupSettingsOpen] = useState(false)
	const groupName: string = 'Fotbal 2A3'
	const status: string = 'online'
	const messages: Message[] = [
		{
			imageURL: '',
			content: 'Que pasa bro?',
		},
		{
			imageURL: '',
			content: 'Brick by brick',
		},
	]

	const groupMembers = ['Goldan David', 'Smau Robert', 'Onofrei Radu', 'Dascaliu Ianis', 'Lionel Fortnite']

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
					<div className="social-chat-top">
						<div className="chat-title-container">
							<DisplayPhoto />
							<div className="chat-title">
								<div>{groupName}</div>
								{status === 'online' ? (
									<div className="active">active now</div>
								) : (
									<div className="offline">offline</div>
								)}
							</div>
						</div>
						<CiSettings
							cursor={'pointer'}
							onClick={() => setIsGroupSettingsOpen(true)}
						/>
					</div>
					<div className="social-chat-content">
						{messages.map((m, idx) => (
							<div key={idx}>
								<DisplayPhoto imagePath={m.imageURL} />
								<div>{m.content}</div>
							</div>
						))}
					</div>
					<div className="social-chat-message-bar"></div>
					<div className="social-right-container">
						<div className="social-right-container"></div>
					</div>
				</div>
			</div>

			{/* Group Settings Modal */}
			{isGroupSettingsOpen && (
				<GroupSettingsModal
					groupMembers={groupMembers}
					onClose={() => setIsGroupSettingsOpen(false)}
				/>
			)}
		</Layout>
	)
}

export default Social