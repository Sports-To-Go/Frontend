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
            headers: { Authorization: `Bearer ${token}` },
        })
        const previews = response.data.map((item: any) => ({
            groupID: item.id,
            name: item.name,
            description: item.description ?? '',
            image:
                'https://dashboard.codeparrot.ai/api/image/Z_T76IDi91IKZZrg/image.png',
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

    // Create a single WebSocket connection ref.
    const wsRef = useRef<WebSocket | null>(null)

    // 1. Use WebSocket for all subsequent events.
    useEffect(() => {
        wsRef.current = new WebSocket(`ws://${BACKEND_URL}/social/ws`)
        wsRef.current.onopen = () => {
            console.log('WebSocket connection established for Social')
            // Use WebSocket to update real-time operations (e.g. join confirmations)
            wsRef.current?.send(JSON.stringify({ action: 'fetchPreviews' }))
        }
        wsRef.current.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data)
                // Process WebSocket messages here
                if (msg.action === 'groupJoined') {
                    console.log('Group joined:', msg)
                    // (Optionally update state based on msg.payload)
                }
                // Handle other actions…
            } catch (error) {
                console.error('Error processing WS message:', error)
            }
        }
        wsRef.current.onerror = (e) => {
            console.error('WebSocket error:', e)
        }
        return () => wsRef.current?.close()
    }, [])

    // 2. Fetch initial data only once via GET.
    useEffect(() => {
        fetchGroupPreviews(setChatPreviews, `http://${BACKEND_URL}/social/chat-previews`)
        fetchGroupPreviews(setRecommendations, `http://${BACKEND_URL}/social/recommended-groups`)
    }, [])

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // 3. Use WebSocket for join, leaving and other events.
    const handleJoinGroup = async (groupID: number) => {
        try {
            const currentUser = auth?.currentUser
            const token = await currentUser?.getIdToken()
            const payload = { token, groupID }
            wsRef.current?.send(JSON.stringify({ action: 'joinGroup', payload }))
        } catch (err) {
            console.error('Error joining group:', err)
        }
    }

    const handleLeaveGroup = async (groupID: number) => {
        try {
            const currentUser = auth?.currentUser
            const token = await currentUser?.getIdToken()
            // Leave action is still done via GET for this example,
            // but can be switched to WebSocket if needed.
            await axios.delete(`http://${BACKEND_URL}/social/group/${groupID}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setChatPreviews((prev) =>
                prev.filter((group) => group.groupID !== groupID)
            )
            setSelectedGroup(null)
        } catch (err) {
            console.error('Error leaving the group:', err)
        }
    }

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
                {/* Left panel: group list */}
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
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <ul className="message-list">
                            {(activeTab === 'myGroups' ? chatPreviews : recommendations)
                                .filter(
                                    (preview) =>
                                        preview.name.toLowerCase().includes(search.toLowerCase()) ||
                                        preview.description.toLowerCase().includes(search.toLowerCase())
                                )
                                .map((preview, index) => (
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
                {/* Right panel: display GroupDetails or GroupChat */}
                <div className="social-right-container">
                    {selectedGroup ? (
                        activeTab === 'myGroups' ? (
                            <GroupChat
                                groupID={selectedGroup.groupID}
                                onBack={handleBack}
                                onLeave={() => handleLeaveGroup(selectedGroup.groupID)}
                            />
                        ) : (
                            // Pass the join function to GroupDetails via onApply
                            <GroupDetails
                                image={selectedGroup.image}
                                name={selectedGroup.name}
                                description={selectedGroup.description}
                                members={selectedGroup.members}
                                isOnline={selectedGroup.isOnline}
                                groupID={selectedGroup.groupID}
                                onBack={handleBack}
                                onApply={() => handleJoinGroup(selectedGroup.groupID)}
                            />
                        )
                    ) : showGroupForm ? (
                        <GroupForm onClose={handleBack} createGroup={() => {}} />
                    ) : (
                        <div className="add-group-placeholder">
                            <div className="add-group-button" onClick={() => setShowGroupForm(true)}>
                                +
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Social
