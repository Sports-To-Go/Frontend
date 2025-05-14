import { useState, FC, useEffect, SetStateAction, useRef } from 'react'
import './Social.scss'
import Layout from '../../components/Layout/Layout'
import GroupPreview from '../../components/GroupPreview/GroupPreview'
import GroupDetails from '../../components/GroupDetails/GroupDetails'
import GroupChat from '../../components/GroupChat/GroupChat'
import axios from 'axios'
import { BACKEND_URL } from '../../../integration-config'
import { auth } from '../../firebase/firebase'
import GroupForm from '../../components/GroupForm/GroupForm'
import { FaSearch } from 'react-icons/fa';

interface GroupPreview {
	groupID: number
	name: string
	description: string
	image: string
	isOnline: boolean
	members: number
}

const fetchGroupPreviews = async (
	setGroupPreviews: {
		(value: SetStateAction<GroupPreview[]>): void
		(arg0: any): void
	},
	RequestURL: string,
) => {
	try {
		const currentUser = auth?.currentUser
		const token = await currentUser?.getIdToken()

		const response = await axios.get(RequestURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		console.log(response.data)

		const previews = response.data.map((item: any) => ({
			groupID: item.id,
			name: item.name,
			description: item.description ?? '',
			image: 'https://dashboard.codeparrot.ai/api/image/Z_T76IDi91IKZZrg/image.png',
			isOnline: true,
			members: item.memberCount,
		}))

		setGroupPreviews(previews)
	} catch (err) {
		console.error('Error fetching chat previews: ' + err)
	}
}

const Social: FC = () => {
	const [activeTab, setActiveTab] = useState<'myGroups' | 'lookForGroups'>('myGroups')
	const [search, setSearch] = useState('')
	const [selectedGroup, setSelectedGroup] = useState<any | null>(null)
	const [showGroupForm, setShowGroupForm] = useState(false)
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

	const [chatPreviews, setChatPreviews] = useState<GroupPreview[]>([])
	const [recommendations, setRecommendations] = useState<GroupPreview[]>([])

	const handleCreateGroup = async (name: string, description: string, photo: File | null) => {
		if (!name.trim()) {
			alert('Group name is required')
			return
		}

		try {
			const currentUser = auth?.currentUser
			const token = await currentUser?.getIdToken()

			const response = await axios.post(
				`http://${BACKEND_URL}/social/group`,
				{ name: name, description: description }, //image: photo },
				{ headers: { Authorization: `Bearer ${token}` } },
			)

			console.log(response)
			const newPreview: GroupPreview = {
				groupID: response.data.id,
				name: response.data.name,
				description: '',
				image: 'https://dashboard.codeparrot.ai/api/image/Z_T76IDi91IKZZrg/image.png',
				isOnline: true,
				members: 1,
			}

			setChatPreviews([...chatPreviews, newPreview])
		} catch (err) {
			console.error('Error creating group:', err)
		}
	}

	const handleLeaveGroup = async (groupID: number) => {
		try {
			const currentUser = auth?.currentUser
			const token = await currentUser?.getIdToken()

			await axios.delete(`http://${BACKEND_URL}/social/group/${groupID}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			// Remove the group from the chatPreviews list
			setChatPreviews(prev => prev.filter(group => group.groupID !== groupID))

			// Close the chat view
			setSelectedGroup(null)
		} catch (err) {
			console.error('Error leaving the group:', err)
		}
	}

	const hasFetched = useRef(false)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768)
		}
		window.addEventListener('resize', handleResize)

		if (!hasFetched.current) {
			fetchGroupPreviews(setChatPreviews, `http://${BACKEND_URL}/social/chat-previews`)
			fetchGroupPreviews(setRecommendations, `http://${BACKEND_URL}/social/recommended-groups`)
			hasFetched.current = true
		}

		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const groupPreviews = activeTab === 'myGroups' ? chatPreviews : recommendations

	const filteredGroupPreviews = groupPreviews.filter(
		preview =>
			preview.name.toLowerCase().includes(search.toLowerCase()) ||
			preview.description.toLowerCase().includes(search.toLowerCase()),
	)

	const handleGroupClick = (group: GroupPreview) => {
		setSelectedGroup(group)
	}

	const handleBack = () => {
		setSelectedGroup(null)
		setShowGroupForm(false)
	}

	return (
		<Layout>
			<div className="social-container">
				{/* Show group list only on mobile when no group selected, or always on desktop */}
				{(!isMobile || (isMobile && !selectedGroup && !showGroupForm)) && (
					<div className="social-left-container">
						<div className="upper-message-preview">
							<div className="tabs">
								<div
									onClick={() => {
										setActiveTab('myGroups')
										setSelectedGroup(null)
									}}
									className={`tab ${activeTab === 'myGroups' ? 'active' : ''}`}
								>
									My Groups
								</div>
								<div
									onClick={() => {
										setActiveTab('lookForGroups')
										setSelectedGroup(null)
									}}
									className={`tab ${activeTab === 'lookForGroups' ? 'active' : ''}`}
								>
									Look for Groups
								</div>
							</div>

							<div className="search-bar">
								<FaSearch className="search-icon" />
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
				)}

				{/* Show chat/details only when a group is selected */}
				<div className="social-right-container">
					{selectedGroup ? (
						activeTab === 'myGroups' ? (
							<GroupChat
								groupID={selectedGroup.groupID}
								onBack={handleBack}
								onLeave={() => handleLeaveGroup(selectedGroup.groupID)}
							/>
						) : (
							<GroupDetails
								image={selectedGroup.image}
								name={selectedGroup.name}
								description={selectedGroup.description}
								members={selectedGroup.members}
								isOnline={selectedGroup.isOnline}
								onBack={handleBack}
								groupID={selectedGroup.groupID}
							/>
						)
					) : showGroupForm ? (
						<GroupForm onClose={handleBack} createGroup={handleCreateGroup} />
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
