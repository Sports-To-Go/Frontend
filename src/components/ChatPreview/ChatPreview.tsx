import { FC, memo } from 'react'
import { CiUser } from 'react-icons/ci'
import './ChatPreview.scss'
import groupplaceholder from '../../assets/groupplaceholder.png'

interface GroupPreviewProps {
	image: string
	name: string
	description: string
	members: number
	onClick?: () => void
}

const GroupPreview: FC<GroupPreviewProps> = memo(
	({ name, image, description, members, onClick }) => {
		return (
			<li className="message-item" onClick={onClick}>
				<div className="group-avatar-container">
					<img
						src={image || groupplaceholder}
						alt={`${name}'s avatar`}
						className="group-avatar"
					/>
				</div>
				<div className="group-info">
					<div className="group-name">{name}</div>
					<div className="group-description">{description}</div>
				</div>
				{members !== 0 && (
					<div className="members-info">
						<CiUser />
						<span className="members-count">{members}</span>
					</div>
				)}
			</li>
		)
	},
)

export default GroupPreview
