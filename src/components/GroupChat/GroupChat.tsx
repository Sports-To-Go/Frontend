import { FC, useEffect, useState } from 'react'
import ChatHeader from '../ChatHeader/ChatHeader'
import ChatMessages from '../ChatMessages/ChatMessages'
import ChatMessageBar from '../ChatMessageBar/ChatMessageBar'
import GroupSettings from '../GroupSettings/GroupSettings'
import './GroupChat.scss'
import { useSocial, Message } from '../../context/SocialContext'

interface GroupProps {
	groupID: number
	onBack: () => void
	onLeave: () => void
}

interface GroupMessage {
	id: number
	senderName: string
	senderID: string
	content: string
	timestamp: string
}

const GroupChat: FC<GroupProps> = ({ groupID, onBack }) => {
	const [newMessage, setNewMessage] = useState('')
	const [isGroupSettingsOpen, setIsGroupSettingsOpen] = useState(false)
	const [groupName, setGroupName] = useState("Loading...")
	const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([])
	const [groupMembers, setGroupMembers] = useState<Map<string, any>>(new Map())
	const [joinRequests, setJoinRequests] = useState<any[]>([])

	const {
		state: { messages, members, selectedGroup },
		sendMessage,
	} = useSocial()

	useEffect(() => {
		if (selectedGroup) {
			setGroupName(selectedGroup.name)
			
			// Get messages for this group and convert to GroupMessage format
			const rawMessages = messages.get(selectedGroup.id) || []
			const formattedMessages: GroupMessage[] = rawMessages.map((msg: Message) => ({
				id: msg.id,
				senderID: msg.senderID,
				senderName: members.get(msg.senderID)?.displayName || 'Unknown User',
				content: msg.content,
				timestamp: msg.timestamp
			}))
			
			setGroupMessages(formattedMessages)
		}
	}, [selectedGroup, messages, members])

	const handleSendMessage = () => {
		if (!newMessage.trim()) return
		
		sendMessage(newMessage)
		setNewMessage('')
	}

	const [themeGradient, setThemeGradient] = useState<string>(
		'linear-gradient(to right, #ffffff, #ffffff)',
	)

	return (
		<div
			className="chat-container"
			style={{
				background: themeGradient,
				backgroundSize: themeGradient.includes('url(') ? 'cover' : 'initial',
				backgroundPosition: themeGradient.includes('url(') ? 'center' : 'initial',
			}}
		>
			<ChatHeader
				groupName={groupName}
				status="online"
				onBack={onBack}
				onOpenSettings={() => setIsGroupSettingsOpen(true)}
			/>
			<ChatMessages messages={groupMessages} />
			<ChatMessageBar
				newMessage={newMessage}
				onMessageChange={setNewMessage}
				onSendMessage={handleSendMessage}
			/>
			{isGroupSettingsOpen && (
				<GroupSettings
					groupMembers={[...groupMembers.values()]}
					joinRequests={joinRequests}
					handleJoinRequest={(id: string, accepted: boolean) => {}}
					onClose={() => setIsGroupSettingsOpen(false)}
					onThemeChange={setThemeGradient}
					groupID={groupID}
				/>
			)}
		</div>
	)
}

export default GroupChat