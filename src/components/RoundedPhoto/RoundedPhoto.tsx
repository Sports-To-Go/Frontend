import React from 'react'
import './RoundedPhoto.scss'

interface RoundedPhotoProps {
	imagePath?: string
	size?: number
}

const RoundedPhoto: React.FC<RoundedPhotoProps> = ({ imagePath, size }) => {
	return (
		<img
			src={`${imagePath ? imagePath : './src/assets/placeholder.png'}`}
			className="rounded-photo"
			width={size || 24}
			height={size || 24}
		></img>
	)
}

export default RoundedPhoto
