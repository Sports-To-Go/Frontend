import DisplayPhoto from '../../components/DisplayPhoto/DisplayPhoto'
import Layout from '../../components/Layout/Layout'
import './Social.scss'

import { RxHamburgerMenu } from 'react-icons/rx'


class Message {
	imageURL: string = ""
	content: string = ""
}

const Social: React.FC = () => {
	const groupName: string = 'Fotbal 2A3'
	const status: string = 'online'
	const messages: Message[] = [
		{
			imageURL: "",
			content: "Que pasa bro?"
		},
		{
			imageURL: "",
			content: "Brick by brick"
		}
	];
	return (
		<Layout>
			<div className="social-container">
				<div className="social-left-container"></div>
				<div className="social-right-container">
					<div className="social-chat-top">
						<div className="chat-title-container">
							<DisplayPhoto />
							<div className="chat-title">
								<div>{groupName}</div>
								{status == 'online' ? (
									<div className="active">active now</div>
								) : (
									<div className="offline">offline</div>
								)}
							</div>
						</div>
						<RxHamburgerMenu
							onClick={() => {
								alert('chat settings to be implemented')
							}}
						/>
					</div>
					<div className="social-chat-content">
						{messages.map(m => (
							<>
								<DisplayPhoto imagePath={m.imageURL}/>
								<div>{m.content}</div>
							</>
						))}
					</div>
					<div className="social-chat-message-bar"></div>
				</div>
			</div>
		</Layout>
	)
}

export default Social
