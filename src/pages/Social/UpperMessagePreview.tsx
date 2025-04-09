import React, { useState } from 'react'
import './UpperMessagePreview.scss'

const UpperMessagePreview: React.FC = () => {
	const [activeTab, setActiveTab] = useState('myGroups')

	return (
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
				/>
			</div>
		</div>
	)
}

export default UpperMessagePreview