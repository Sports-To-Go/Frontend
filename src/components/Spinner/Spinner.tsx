import { FC } from 'react'
import './Spinner.scss'

interface SpinnerProps {
	size?: number // in px
	color?: string
}

const Spinner: FC<SpinnerProps> = ({ size = 32, color = '#888' }) => {
	return (
		<div className="spinner-container">
			<div
				className="spinner"
				style={{
					width: size,
					height: size,
					borderColor: `${color} transparent ${color} transparent`,
				}}
			/>
		</div>
	)
}

export default Spinner
