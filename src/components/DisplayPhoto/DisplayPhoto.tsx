import React from 'react'
import './DisplayPhoto.scss'

interface DisplayPhotoProps {
	imagePath?: string
}

const DisplayPhoto: React.FC<DisplayPhotoProps> = ({ imagePath }) => {
	return (
		<img
			src={`${imagePath ? imagePath : './src/assets/placeholder.png'}`}
			className="display-photo"
		></img>
	)
}

export default DisplayPhoto
