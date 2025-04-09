import React from 'react'
import './LowerMessagePreview.scss'
import GroupPreview from '../../components/GroupPreview/GroupPreview';

const LowerMessagePreview: React.FC = () => {
	const messages = Array(20).fill({
		name: 'Random Group Name',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		image: 'https://dashboard.codeparrot.ai/api/image/Z_T76IDi91IKZZrg/image.png',
		isOnline: true,
		members: 5,
	})

	return (
		<div className="lower-message-preview">
			<ul className="message-list">
				{messages.map((message, index) => (
					<GroupPreview name={message.name} image={message.image} isOnline={message.isOnline} description={message.description} members={message.members} key = {index}/>
				))}
			</ul>
		</div>
	)
}

export default LowerMessagePreview