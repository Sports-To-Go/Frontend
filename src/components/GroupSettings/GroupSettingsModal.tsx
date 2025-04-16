import React, { useState } from 'react'
import './GroupSettingsModal.scss'

interface GroupSettingsModalProps {
	groupMembers: string[]
	onClose: () => void
}

const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({ groupMembers, onClose }) => {
	const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)
	const [activeModal, setActiveModal] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('') 

	const closeModal = () => {
		setActiveModal(null)
		setIsMembersModalOpen(false)
		setSearchQuery('') 
	}

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div
				className="modal fade-in"
				onClick={e => e.stopPropagation()} 
			>
				<h3>Group Settings</h3>

				{/* Chat Info Section */}
				<div className="section">
					<h4>Chat Info</h4>
					<div>
						<span
							className="see-members-text"
							onClick={() => setIsMembersModalOpen(true)}
						>
							See Members
						</span>
					</div>
				</div>

				{/* Customization Section */}
				<div className="section">
					<h4>Customization</h4>
					<div className="customization-buttons">
						<span
							className="customization-button"
							onClick={() => setActiveModal('Theme')}
						>
							Theme
						</span>
						<span
							className="customization-button"
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
							className="action-button"
							onClick={() => setActiveModal('View Media & Files')}
						>
							View Media & Files
						</span>
						<span
							className="action-button"
							onClick={() => setActiveModal('Pinned Messages')}
						>
							Pinned Messages
						</span>
						<span
							className="action-button"
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
							className="action-button"
							onClick={() => setActiveModal('Notifications')}
						>
							Notifications
						</span>
						<span
							className="action-button"
							onClick={() => setActiveModal('Report')}
						>
							Report
						</span>
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
					<div
						className="modal fade-in"
						onClick={e => e.stopPropagation()} 
					>
						<h3>Group Members</h3>
						<ul>
							{groupMembers.map((member, index) => (
								<li key={index}>{member}</li>
							))}
						</ul>
						<span
							className="close-members-modal"
							onClick={closeModal}
						>
							Close
						</span>
					</div>
				</div>
			)}

			{/* Dynamic Modals */}
			{activeModal && (
				<div className="members-modal" onClick={closeModal}>
					<div
						className="modal fade-in"
						onClick={e => e.stopPropagation()} 
					>
						<h3>{activeModal}</h3>
						{activeModal === 'Search in Conversation' ? (
							<div>
								{/* Search Bar */}
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
						<span
							className="close-members-modal"
							onClick={closeModal}
						>
							Close
						</span>
					</div>
				</div>
			)}
		</div>
	)
}

export default GroupSettingsModal