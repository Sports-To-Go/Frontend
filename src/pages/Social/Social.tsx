import DisplayPhoto from '../../components/DisplayPhoto/DisplayPhoto'
import { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import GroupPreview from '../../components/GroupPreview/GroupPreview'
import './Social.scss'
import { CiSettings } from 'react-icons/ci'

class Message {
	imageURL: string = ''
	content: string = ''
}

const Social: React.FC = () => {
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
	const [activeTab, setActiveTab] = useState<'myGroups' | 'lookForGroups'>('myGroups')
	const [search, setSearch] = useState('')

	const groupPreviews = Array(20).fill({
		name: 'Random Group Name',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		image: 'https://dashboard.codeparrot.ai/api/image/Z_T76IDi91IKZZrg/image.png',
		isOnline: true,
		members: 5,
	})

	const filteredGroupPreviews = groupPreviews.filter(
		preview =>
			preview.name.toLowerCase().includes(search.toLowerCase()) ||
			preview.description.toLowerCase().includes(search.toLowerCase()),
	)
	return (
		<Layout>
			<div className="social-container">
				<div className="social-left-container">
					<div className="upper-message-preview">
						{/* Tabs */}
						<div className="tabs">
							<div
								onClick={() => setActiveTab('myGroups')}
								className={`tab ${activeTab === 'myGroups' ? 'active' : ''}`}
							>
								My Groups
							</div>
							<div
								onClick={() => setActiveTab('lookForGroups')}
								className={`tab ${activeTab === 'lookForGroups' ? 'active' : ''}`}
							>
								Look for Groups
							</div>
						</div>
						{/* Search Bar */}
						<div className="search-bar">
							<img
								src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/18d59d14-50c4-44d5-9a7d-67e729ab83ba"
								alt="search"
								className="search-icon"
							/>
							<input
								type="text"
								placeholder="Search for groups in SportsToGo"
								className="search-input"
								value={search}
								onChange={e => setSearch(e.target.value)}
							/>
						</div>
					</div>
					<ul className="message-list">
						{filteredGroupPreviews.map((preview, index) => (
							<GroupPreview
								key={index}
								name={preview.name}
								image={preview.image}
								isOnline={preview.isOnline}
								description={preview.description}
								members={preview.members}
							/>
						))}
					</ul>
				</div>

				{/* Right Section */}
				<div className="social-right-container">
					<div className="social-chat-top">
						<div className="chat-title-container">
							<DisplayPhoto />
							<div className="chat-title">
								<div>{groupName}</div>
								{status == 'online' ? (
									<div className="active">active now</div>
								) : (
									<div className="offline">offline</div>
								)}
							</div>
						</div>
						<CiSettings
							cursor={'pointer'}
							onClick={() => {
								alert('chat settings to be implemented')
							}}
						/>
					</div>
					<div className="social-chat-content">
						{messages.map(m => (
							<>
								<DisplayPhoto imagePath={m.imageURL} />
								<div>{m.content}</div>
							</>
						))}
					</div>
					<div className="social-chat-message-bar"></div>
				</div>
			</div>
		</Layout>
	)
}

export default Social
