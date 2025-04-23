import React, { useState } from 'react'
import './GroupSettingsModal.scss'

interface GroupSettingsModalProps {
	groupMembers: string[]
	onClose: () => void
	onThemeChange: (theme: string) => void 
}

const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({ groupMembers, onClose, onThemeChange }) => {
	const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)
	const [isThemeModalOpen, setIsThemeModalOpen] = useState(false) 
	const [activeModal, setActiveModal] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('') 

	const closeModal = () => {
		setActiveModal(null)
		setIsMembersModalOpen(false)
		setIsThemeModalOpen(false)
		setSearchQuery('') 
	}

	// Handle theme selection
	const handleThemeChange = (theme: string) => {
		onThemeChange(theme)
	}

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal fade-in" onClick={e => e.stopPropagation()}>
				<h3>Group Settings</h3>

				<div className="sections-wrapper">
					{/* Chat Info Section */}
					<div className="section">
						<h4>Chat Info</h4>
						<div className="action-buttons">
							<span className="modal-button" onClick={() => setIsMembersModalOpen(true)}>
								See Members
							</span>
						</div>
					</div>

					{/* Customization Section */}
					<div className="section">
						<h4>Customization</h4>
						<div className="customization-buttons">
							<span
								className="modal-button"
								onClick={() => setIsThemeModalOpen(true)} 
							>
								Theme
							</span>
							<span
								className="modal-button"
								onClick={() => setActiveModal('Nicknames')}
							>
								Nicknames
							</span>
						</div>
					</div>

					{/* More Actions Section */}
					<div className="section">
						<h4>More Actions</h4>
						<div className="action-buttons">
							<span
								className="modal-button"
								onClick={() => setActiveModal('View Media & Files')}
							>
								View Media & Files
							</span>
							<span
								className="modal-button"
								onClick={() => setActiveModal('Pinned Messages')}
							>
								Pinned Messages
							</span>
							<span
								className="modal-button"
								onClick={() => setActiveModal('Search in Conversation')}
							>
								Search in Conversation
							</span>
						</div>
					</div>

					{/* Privacy & Support Section */}
					<div className="section">
						<h4>Privacy & Support</h4>
						<div className="action-buttons">
							<span
								className="modal-button"
								onClick={() => setActiveModal('Notifications')}
							>
								Notifications
							</span>
							<span
								className="modal-button"
								onClick={() => setActiveModal('Report')}
							>
								Report
							</span>
						</div>
					</div>
				</div>

				{/* Leave Chat Button */}
				<span
					className="leave-chat-button"
					onClick={() => alert('You have left the chat.')}
				>
					Leave Chat
				</span>
			</div>

			{/* Members Modal */}
			{isMembersModalOpen && (
				<div className="members-modal" onClick={closeModal}>
					<div className="modal fade-in" onClick={e => e.stopPropagation()}>
						<h3>Group Members</h3>
						<ul>
							{groupMembers.map((member, index) => (
								<li key={index}>{member}</li>
							))}
						</ul>
						<span className="close-members-modal" onClick={closeModal}>
							Close
						</span>
					</div>
				</div>
			)}

			{/* Theme Modal */}
			{isThemeModalOpen && (
				<div className="members-modal" onClick={closeModal}>
					<div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
						<h3>Select a Theme</h3>
						<div className="theme-buttons">
							{/* Add theme buttons */}
							<button
								className="theme-button"
								onClick={() => handleThemeChange('linear-gradient(to right,var(--background),var(--background))')}
							>
								Default
							</button>
							<button
								className="theme-button"
								onClick={() => handleThemeChange('linear-gradient(to right,rgb(215, 84, 101),rgb(233, 125, 86))')}
							>
								Orange
							</button>
							<button
								className="theme-button"
								onClick={() => handleThemeChange('linear-gradient(to right,rgb(113, 245, 205), #6dd5ed)')}
							>
								Blue
							</button>
							<button
								className="theme-button"
								onClick={() => handleThemeChange('linear-gradient(to right,rgb(101, 48, 198),rgb(229, 97, 198))')}
							>
								Purple
							</button>
							<button
								className="theme-button"
								onClick={() => handleThemeChange('linear-gradient(to right,rgb(32, 225, 126), var(--background))')}
							>
								Mint
							</button>
							<button
								className="theme-button"
								onClick={() => handleThemeChange('linear-gradient(to right,rgb(203, 70, 112),rgb(127, 221, 210))')}
							>
								Sakura
							</button>
							<button
								className="theme-button"
								onClick={() => handleThemeChange('url(https://i.pinimg.com/736x/ed/de/89/edde897bf47591b076ebea01ca370bc8.jpg)')}
							>
								Lebrawnm Jamezz 
							</button>
							<button
								className="theme-button"
								onClick={() => handleThemeChange('url(https://cdn.thingiverse.com/assets/10/1e/80/c8/85/large_display_ab67616d00001e026267a426d1ca9c22b813835a1.jpg)')}
							>
								Tralalero Tralala 
							</button>
							<button
								className="theme-button"
								onClick={() => handleThemeChange('url(https://cdn-0001.qstv.on.epicgames.com/DeWFZjGciBtKpknWZf/image/landscape_comp.jpeg)')}
							>
								Bombardillo Crocodilo 
							</button>
						</div>
						<span className="close-members-modal" onClick={closeModal}>
							Close
						</span>
					</div>
				</div>
			)}

			{/* Dynamic Modals */}
			{activeModal && !isThemeModalOpen && !isMembersModalOpen && (
				<div className="members-modal" onClick={closeModal}>
					<div className="modal fade-in" onClick={e => e.stopPropagation()}>
						<h3>{activeModal}</h3>
						{activeModal === 'Search in Conversation' ? (
							<div>
								<input
									type="text"
									className="search-bar"
									placeholder="Search messages..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
								<p>Search results for "{searchQuery}" to be added.</p>
							</div>
						) : (
							<p>Content for "{activeModal}" to be added.</p>
						)}
						<span className="close-members-modal" onClick={closeModal}>
							Close
						</span>
					</div>
				</div>
			)}
		</div>
	)
}

export default GroupSettingsModal