import { FC, useEffect, useRef, useState } from 'react'
import { useSocial } from '../../context/SocialContext'
import Layout from '../../components/Layout/Layout'
import './Social.scss'
import ChatPreview from '../../components/ChatPreview/ChatPreview'
import GroupChat from '../../components/GroupChat/GroupChat'
import GroupDetails from '../../components/GroupDetails/GroupDetails'
import GroupForm from '../../components/GroupForm/GroupForm'
import Spinner from '../../components/Spinner/Spinner'
import { CiSearch } from 'react-icons/ci'
import { useAuth } from '../../context/UserContext'

const Social: FC = () => {
	const [activeTab, setActiveTab] = useState<'myGroups' | 'lookForGroups'>('myGroups')
	const [search, setSearch] = useState('')
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
	const [showGroupForm, setShowGroupForm] = useState(false)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	const {
		state: { groups, recommendations, selectedGroup, members },
		connectSocial,
		selectGroup,
	} = useSocial()

	const { user } = useAuth()
	if (user === null) return

	const mounted = useRef(false)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768)
		}
		window.addEventListener('resize', handleResize)

		const init = async () => {
			if (!mounted.current) {
				setIsLoading(true)
				await connectSocial()
				setIsLoading(false)
				mounted.current = true
			}
		}

		init()

		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const groupPreviews = activeTab === 'myGroups' ? groups : recommendations

	const filteredGroupPreviews = groupPreviews.filter(
		preview =>
			preview.name.toLowerCase().includes(search.toLowerCase()) ||
			preview.description.toLowerCase().includes(search.toLowerCase()),
	)

	const handleBack = () => {
		setShowGroupForm(false)
		selectGroup(null)
	}

	// Helper function to get display text for ChatPreview
	const getPreviewText = (group: any) => {
		if (activeTab === 'lookForGroups') {
			// For recommendations, always show description
			return group.description
		}

		// For myGroups, show last message if it exists, otherwise show description
		if (group.lastMessage) {
			return `${group.lastMessage.senderID === user.uid ? 'You' : members.get(group.id)?.get(group.lastMessage.senderID)?.displayName || 'Unknown'}: ${group.lastMessage.content}`
		}

		return group.description
	}

	return (
		<Layout>
			<div className="social-container">
				<div className="social-left-container">
					{(!isMobile || (isMobile && !selectedGroup && !showGroupForm)) && (
						<>
							<div className="upper-message-preview">
								<div className="tabs">
									<div
										onClick={() => {
											setActiveTab('myGroups')
											selectGroup(null)
										}}
										className={`tab ${activeTab === 'myGroups' ? 'active' : ''}`}
									>
										My Groups
									</div>
									<div
										onClick={() => {
											setActiveTab('lookForGroups')
											selectGroup(null)
										}}
										className={`tab ${activeTab === 'lookForGroups' ? 'active' : ''}`}
									>
										Look for Groups
									</div>
								</div>

								<div className="search-bar">
									<CiSearch className="search-icon" />
									<input
										type="text"
										placeholder="Search for groups in SportsToGo"
										className="search-input"
										value={search}
										onChange={e => setSearch(e.target.value)}
									/>
								</div>
							</div>

							{isLoading ? (
								<Spinner />
							) : (
								<ul className="message-list">
									{filteredGroupPreviews.map(preview => {
										return (
											<ChatPreview
												key={preview.id}
												name={preview.name}
												image={preview.imageUrl}
												description={getPreviewText(preview)}
												members={preview.memberCount || 0}
												onClick={() => selectGroup(preview)}
											/>
										)
									})}
								</ul>
							)}
						</>
					)}
				</div>

				<div className="social-right-container">
					{selectedGroup ? (
						activeTab === 'myGroups' ? (
							<GroupChat groupID={selectedGroup.id} onBack={handleBack} onLeave={() => {}} />
						) : (
							<GroupDetails
								image={selectedGroup.imageUrl}
								name={selectedGroup.name}
								description={selectedGroup.description}
								members={selectedGroup.memberCount || 0}
								onBack={handleBack}
								groupID={selectedGroup.id}
							/>
						)
					) : showGroupForm ? (
						<GroupForm onClose={handleBack} />
					) : (
						<div className="add-group-placeholder">
							<div className="add-group-button" onClick={() => setShowGroupForm(true)}>
								+
							</div>
						</div>
					)}
				</div>

				{/* Floating + button for mobile */}
				{isMobile && !selectedGroup && !showGroupForm && (
					<div className="add-group-floating-button" onClick={() => setShowGroupForm(true)}>
						+
					</div>
				)}
			</div>
		</Layout>
	)
}

export default Social
