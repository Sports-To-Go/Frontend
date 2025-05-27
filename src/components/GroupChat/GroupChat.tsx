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

const GroupChat: FC<GroupProps> = ({ groupID, onBack }) => {
	const [newMessage, setNewMessage] = useState('')
	const [isGroupSettingsOpen, setIsGroupSettingsOpen] = useState(false)
	const [groupName, setGroupName] = useState('Loading...')
	const [joinRequests, setJoinRequests] = useState<any[]>([])
	const [loadingHistory, setLoadingHistory] = useState(false)

	const {
		state: { messages, members, selectedGroup },
		sendMessage,
		loadMessageHistory,
	} = useSocial()

	const rawMessages = selectedGroup ? messages.get(selectedGroup.id) || [] : []

	const groupMessages: (Message & { senderName?: string })[] = rawMessages.map((msg: Message) => {
		const groupMember = members.get(groupID)?.get(msg.senderID)
		return {
			...msg,
			senderName: msg.type === 'SYSTEM' ? '' : groupMember?.displayName || 'Unknown User',
		}
	})

	useEffect(() => {
		if (selectedGroup) {
			setGroupName(selectedGroup.name)
			const currentMessages = messages.get(selectedGroup.id) || []
			if (currentMessages.length === 0) {
				loadMessageHistory(selectedGroup.id, new Date().toISOString().replace('Z', ''))
			}
		}
	}, [selectedGroup])

	const handleSendMessage = () => {
		if (!newMessage.trim()) return
		sendMessage(newMessage)
		setNewMessage('')
	}

	const handleLoadMore = async () => {
		if (!selectedGroup || loadingHistory) return
		const oldest = groupMessages[0]?.timestamp
		if (!oldest) return
		setLoadingHistory(true)
		await loadMessageHistory(selectedGroup.id, oldest.replace('Z', ''))
		setLoadingHistory(false)
	}

	const [themeGradient, setThemeGradient] = useState<string>(
		'linear-gradient(to right, var(--background), var(--background))',
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
			<ChatMessages
				messages={groupMessages}
				onTopReached={handleLoadMore}
				loadingTop={loadingHistory}
				groupID={groupID}
			/>
			<ChatMessageBar
				newMessage={newMessage}
				onMessageChange={setNewMessage}
				onSendMessage={handleSendMessage}
			/>
			{isGroupSettingsOpen && (
				<GroupSettings
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
