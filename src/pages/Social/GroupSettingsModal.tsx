import React, { useState } from 'react'
import './GroupSettingsModal.scss'

interface GroupSettingsModalProps {
	groupMembers: string[]
	onClose: () => void
}

const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({ groupMembers, onClose }) => {
	const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)

	return (
		<div className="modal-overlay" onClick={onClose} >
			<div
				className="modal"
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
			</div>

			{/* Members Modal */}
			{isMembersModalOpen && (
				<div className="members-modal" onClick={() => setIsMembersModalOpen(false)}>
					<div
						className="modal"
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
							onClick={() => setIsMembersModalOpen(false)}
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