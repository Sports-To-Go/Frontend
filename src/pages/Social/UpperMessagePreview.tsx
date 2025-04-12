import React, { useState } from 'react'
import './UpperMessagePreview.scss'
import { CiSearch } from "react-icons/ci";

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
				<CiSearch className="search-icon"/>
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