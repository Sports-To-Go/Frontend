// ShareProfileButton.tsx
import { LuShare } from 'react-icons/lu'
import { useState } from 'react'
import './ShareProfileButton.scss'

type Props = {
	username: string
}

const ShareProfileButton = ({ username }: Props) => {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		const mockUrl = `https://sports-to-go.com/profile/${username}`
		await navigator.clipboard.writeText(mockUrl)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="share-profile-button-wrapper">
			<button className="profile-action-button" onClick={handleCopy}>
				<LuShare className="icon" />
				<span>Share Profile</span>
			</button>
			{copied && <div className="copy-tooltip">✓ Link copied!</div>}
		</div>
	)
}

export default ShareProfileButton
