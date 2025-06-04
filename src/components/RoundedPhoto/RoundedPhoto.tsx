import { FC } from 'react'
import './RoundedPhoto.scss'

interface RoundedPhotoProps {
	imagePath: string
	size?: number
}

const RoundedPhoto: FC<RoundedPhotoProps> = ({ imagePath, size }) => {
	return (
		<img
			src={`${imagePath}`}
			className="rounded-photo"
			width={size || 24}
			height={size || 24}
		></img>
	)
}

export default RoundedPhoto
