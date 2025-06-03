import { FC, useEffect, useRef, useState } from 'react'
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
	const [loadingHistory, setLoadingHistory] = useState(false)

	const {
		state: { messages, members, selectedGroup, groups },
		sendMessage,
		loadMessageHistory,
		changeTheme,
		changeNickname,
	} = useSocial()

	const rawMessages = selectedGroup ? messages.get(selectedGroup.id) || [] : []

	const groupMessages: (Message & { senderName?: string })[] = rawMessages.map((msg: Message) => {
		const groupMember = members.get(groupID)?.get(msg.senderID)
		return {
			...msg,
			senderName:
				msg.type === 'SYSTEM'
					? ''
					: groupMember?.nickname || groupMember?.displayName || 'Unknown User',
		}
	})

	const loadedGroupsRef = useRef<Set<number>>(new Set())

	useEffect(() => {
		if (!selectedGroup) return

		setGroupName(selectedGroup.name)

		if (loadedGroupsRef.current.has(selectedGroup.id)) return

		const currentMessages = messages.get(selectedGroup.id) || []
		if (currentMessages.length === 0) {
			loadedGroupsRef.current.add(selectedGroup.id)
			loadMessageHistory(
				selectedGroup.id,
				new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
					.toISOString()
					.slice(0, 23),
			)
		}
	}, [selectedGroup?.id])

	const handleLoadMore = async () => {
		if (!selectedGroup || loadingHistory) return
		const oldest = groupMessages[0]?.timestamp
		if (!oldest) return
		setLoadingHistory(true)
		await loadMessageHistory(selectedGroup.id, oldest.slice(0, 23))
		setLoadingHistory(false)
	}

	const themeMap: Record<string, string> = {
		DEFAULT: 'linear-gradient(to right,var(--background),var(--background))',
		ORANGE: 'linear-gradient(to right,rgb(215, 84, 101),rgb(233, 125, 86))',
		BLUE: 'linear-gradient(to right,rgb(113, 245, 205), #6dd5ed)',
		PURPLE: 'linear-gradient(to right,rgb(101, 48, 198),rgb(229, 97, 198))',
		MINT: 'linear-gradient(to right,rgb(32, 225, 126), rgb(119, 225, 32))',
		SAKURA: 'linear-gradient(to right,rgb(203, 70, 112),rgb(127, 221, 210))',
		DARKNESS: 'linear-gradient(to right,rgb(12, 1, 27),rgb(62, 2, 2))',
		SOFT: 'linear-gradient(to right,rgb(255, 216, 245),rgb(255, 191, 203))',
		WINDOWS: 'url(https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png)',
		'ELDEN RING':
			'url(https://images.steamusercontent.com/ugc/2058741034012526512/379E6434B473E7BE31C50525EB946D4212A8C8B3/)',
		'PIXEL DREAM': 'url(https://images.alphacoders.com/113/1138740.png)',
	}

	const handleThemeKeyChange = (themeKey: string) => {
		if (!themeKey || !selectedGroup) return
		const theme = themeMap[themeKey]
		if (!theme) return
		changeTheme(selectedGroup.id, themeKey)
	}

	const handleSendMessage = (content: string) => {
		if (!newMessage.trim()) return
		sendMessage({ content: content })
		setNewMessage('')
	}

	const handleNicknameChange = (memberID: string, newNickname: string) => {
		const groupMembers = members.get(groupID)
		if (!groupMembers || !selectedGroup) return

		const member = groupMembers.get(memberID)
		if (!member) return

		changeNickname(selectedGroup.id, memberID, newNickname)
	}

	const [themeGradient, setThemeGradient] = useState('')

	useEffect(() => {
		if (!selectedGroup) return

		const group = groups.find(g => g.id === selectedGroup.id)
		const themeKey = group?.theme || 'DEFAULT'
		const newTheme = themeMap[themeKey] || themeMap['DEFAULT']

		setThemeGradient(newTheme)
	}, [selectedGroup, groups])

	return (
		<div
			className="chat-container"
			style={{
				backgroundImage: themeGradient,
				backgroundSize: themeGradient.includes('url(') ? 'cover' : 'initial',
				backgroundPosition: themeGradient.includes('url(') ? 'center' : 'initial',
				backgroundRepeat: 'no-repeat',
				backgroundColor: !themeGradient.includes('url(') ? 'var(--background)' : undefined,
			}}
		>
			<ChatHeader
				groupName={groupName}
				status="online"
				onBack={onBack}
				image={selectedGroup?.imageUrl}
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
					onClose={() => setIsGroupSettingsOpen(false)}
					onThemeChange={handleThemeKeyChange}
					onNicknameChange={handleNicknameChange}
					groupID={groupID}
				/>
			)}
		</div>
	)
}

export default GroupChat
