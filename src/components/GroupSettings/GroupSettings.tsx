import React, { useState } from 'react'
import './GroupSettings.scss'
import ThemeButtons from './ThemeButtons'
import { useAuth } from '../../context/UserContext'
import { useSocial } from '../../context/SocialContext'

interface GroupMember {
	displayName: string
	id: string
	role: string
}

interface JoinRequest {
	id: string
	displayName: string
	motivation: string
}

interface GroupSettingsProps {
	groupMembers: GroupMember[]
	joinRequests: JoinRequest[]
	handleJoinRequest: (id: string, accepted: boolean) => void
	onClose: () => void
	onThemeChange: (theme: string) => void
	groupID: number
}

const GroupSettings: React.FC<GroupSettingsProps> = ({
	groupMembers,
	onClose,
	onThemeChange,
	joinRequests,
	handleJoinRequest,
	groupID,
}) => {
	const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)
	const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)
	const [activeModal, setActiveModal] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [isConfirmingLeave, setIsConfirmingLeave] = useState(false)

	const { leaveGroup } = useSocial()

	const closeModal = () => {
		setActiveModal(null)
		setIsMembersModalOpen(false)
		setIsThemeModalOpen(false)
		setSearchQuery('')
	}

	const handleLeaveChat = async () => {
		if (!isConfirmingLeave) {
			setIsConfirmingLeave(true)
		} else {
			leaveGroup(groupID)
		}
	}

	const sortedMembers = [...groupMembers].sort((a, b) => {
		const roleOrder: Record<string, number> = {
			admin: 0,
			co_admin: 1,
			member: 2,
		}
		return roleOrder[a.role] - roleOrder[b.role]
	})

	const { user } = useAuth()
	const isMember =
		groupMembers.find((member: GroupMember) => {
			return member.id == user?.uid || ''
		})?.role == 'member'

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

					{/* Join Requests Section */}
					{!isMember && (
						<div className="section">
							<h4>Requests</h4>
							<div className="action-buttons">
								<span
									className="modal-button"
									onClick={() => setActiveModal('Join Requests')}
								>
									See Join Requests
								</span>
							</div>
						</div>
					)}

					{/* Customization Section */}
					<div className="section">
						<h4>Customization</h4>
						<div className="customization-buttons">
							<span className="modal-button" onClick={() => setIsThemeModalOpen(true)}>
								Theme
							</span>
							<span className="modal-button" onClick={() => setActiveModal('Nicknames')}>
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
							<span className="modal-button" onClick={() => setActiveModal('Notifications')}>
								Notifications
							</span>
							<span className="modal-button" onClick={() => setActiveModal('Report')}>
								Report
							</span>
						</div>
					</div>
				</div>

				{/* Leave Chat Button */}
				<span className="leave-chat-button" onClick={handleLeaveChat}>
					{isConfirmingLeave ? 'Press to confirm leaving the chat' : 'Leave Chat'}
				</span>
			</div>

			{/* Members Modal */}
			{isMembersModalOpen && (
				<div className="members-modal" onClick={closeModal}>
					<div className="modal fade-in" onClick={e => e.stopPropagation()}>
						<h3>Group Members</h3>
						<ul>
							{sortedMembers.map((member, index) => (
								<li key={index} className={`${member.role}`}>
									{member.displayName}{' '}
									{member.role !== 'member' && <span>({member.role})</span>}
								</li>
							))}
						</ul>
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
									onChange={e => setSearchQuery(e.target.value)}
								/>
								<p>Search results for "{searchQuery}" to be added.</p>
							</div>
						) : activeModal === 'Join Requests' ? (
							joinRequests.length > 0 ? (
								<ul>
									{joinRequests.map((request, index) => (
										<li key={index} className="join-request">
											<strong>{request.displayName}</strong>
											{request.motivation && <p>Motivation: {request.motivation}</p>}
											<div className="action-buttons">
												<button
													className="accept-button"
													onClick={() => handleJoinRequest(request.id, true)}
												>
													Accept
												</button>
												<button
													className="decline-button"
													onClick={() => handleJoinRequest(request.id, false)}
												>
													Decline
												</button>
											</div>
										</li>
									))}
								</ul>
							) : (
								<p>No join requests at the moment.</p>
							)
						) : (
							<p>Content for "{activeModal}" to be added.</p>
						)}
						<span className="close-members-modal" onClick={closeModal}>
							Close
						</span>
					</div>
				</div>
			)}

			{/* Theme Modal */}
			{isThemeModalOpen && (
				<div className="members-modal" onClick={closeModal}>
					<div className="modal fade-in" onClick={e => e.stopPropagation()}>
						<h3>Select a Theme</h3>
						<ThemeButtons onThemeChange={onThemeChange} />
						<span className="close-members-modal" onClick={closeModal}>
							Close
						</span>
					</div>
				</div>
			)}
		</div>
	)
}

export default GroupSettings
