import { FC, useState } from 'react'
import './GroupSettings.scss'
import ThemeButtons from './ThemeButtons'
import { useAuth } from '../../context/UserContext'
import { GroupMember, useSocial } from '../../context/SocialContext'

interface GroupSettingsProps {
	onClose: () => void
	onThemeChange: (theme: string) => void
	onNicknameChange: (group_id: string, nickname: string) => void
	groupID: number
}

const GroupSettings: FC<GroupSettingsProps> = ({
	onClose,
	onThemeChange,
	onNicknameChange,
	groupID,
}) => {
	const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)
	const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)
	const [activeModal, setActiveModal] = useState<string | null>(null)
	const [isConfirmingLeave, setIsConfirmingLeave] = useState(false)

	const {
		state: { members, selectedGroup, groups },
		leaveGroup,
		handleJoinRequest
	} = useSocial()

	const groupMembersMap = selectedGroup ? members.get(selectedGroup.id) : new Map()
	const groupMembers = [...(groupMembersMap?.values() || [])]
	const joinRequests = groups.filter(group => group.id === groupID)[0].joinRequests

	const closeModal = () => {
		setActiveModal(null)
		setIsMembersModalOpen(false)
		setIsThemeModalOpen(false)
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

					{/* Support Section */}
					<div className="section">
						<h4>Support</h4>
						<div className="action-buttons">
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
						{activeModal === 'Join Requests' ? (
							joinRequests.length > 0 ? (
								<ul>
									{joinRequests.map((request, index) => (
										<li key={index} className="join-request">
											<strong>{request.displayName}</strong>
											<div className="action-buttons">
												<button
													className="accept-button"
													onClick={() => handleJoinRequest(groupID, request.id, true)}
												>
													Accept
												</button>
												<button
													className="decline-button"
													onClick={() => handleJoinRequest(groupID, request.id, false)}
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
						) : activeModal === 'Nicknames' ? (
							<div className="nickname-modal">
								<ul className="nicknames-list">
									{sortedMembers.map(member => (
										<li key={member.id}>
											<span>{member.displayName}</span>
											<input
												type="text"
												placeholder="Set nickname"
												defaultValue={member.nickname || ''}
												onBlur={e => onNicknameChange(member.id, e.target.value.trim())}
											/>
										</li>
									))}
								</ul>
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
