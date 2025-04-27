import React from 'react'
import './AdminTab.scss'

interface AdminTabProps {
	label: string
	active: boolean
	onClick: () => void
}

const AdminTab: React.FC<AdminTabProps> = ({ label, active, onClick }) => {
	return (
		<button
			className={`admin-tab ${active ? 'active' : ''}`}
			onClick={onClick}
		>
			{/* Icon placeholder - to be implemented */}
			<span className="icon" />
			<span>{label}</span>
		</button>
	)
}
export default AdminTab