import { useState, FC } from 'react'
import './Social.scss'
import Layout from '../../components/Layout/Layout'
import GroupPreview from '../../components/GroupPreview/GroupPreview'
import GroupDetails from '../../components/GroupDetails/GroupDetails'
import GroupChat from '../../components/GroupChat/GroupChat'

const Social: FC = () => {
	const [activeTab, setActiveTab] = useState<'myGroups' | 'lookForGroups'>('myGroups')
	const [search, setSearch] = useState('')
	const [selectedGroup, setSelectedGroup] = useState<any | null>(null) // State for selected group

	const myGroups = Array.from({ length: 20 }, (_, index) => ({
		groupID: index + 1, 
		name: `MyGroup ${index + 1}`,
		description: `Description for group ${index + 1}`,
		image: 'https://dashboard.codeparrot.ai/api/image/Z_T76IDi91IKZZrg/image.png',
		isOnline: true, 
		members: 8, 
}));

	const lookForGroupsPreviews = Array.from({ length: 10 }, (_, index) => ({
		name: `LookForGroup ${index + 1}`,
		description: `Description for group ${index + 1}`,
		image: 'https://dashboard.codeparrot.ai/api/image/Z_T76IDi91IKZZrg/image.png',
		isOnline: true, 
		members: 8, 
}));

	const groupPreviews = activeTab === 'myGroups' ? myGroups : lookForGroupsPreviews

	const filteredGroupPreviews = groupPreviews.filter(
		preview =>
			preview.name.toLowerCase().includes(search.toLowerCase()) ||
			preview.description.toLowerCase().includes(search.toLowerCase()),
	)

	const handleGroupClick = (group: any) => {
		setSelectedGroup(group)
	}

	const handleBack = () => {
		setSelectedGroup(null)
	}

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
								onClick={() => handleGroupClick(preview)} 
							/>
						))}
					</ul>
				</div>

				{/*Render GroupDetails or GroupChat*/}
				{selectedGroup ? (
					activeTab === 'myGroups' ? (
						<GroupChat groupID={selectedGroup.groupID} />
					) : (
						<GroupDetails
							image={selectedGroup.image}
							name={selectedGroup.name}
							description={selectedGroup.description}
							members={selectedGroup.members}
							isOnline={selectedGroup.isOnline}
							onBack={handleBack}
						/>
					)
				) : (
					<div className="placeholder"></div>
				)}
			</div>
		</Layout>
	)
}

export default Social