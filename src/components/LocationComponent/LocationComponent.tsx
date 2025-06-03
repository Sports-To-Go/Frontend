import React, { useState } from 'react'
import LocationReservationModal from '../LocationComponent/LocationReservationModal'
import { MdOutlineReportProblem } from 'react-icons/md'
import './LocationComponent.scss'
import ReportLocationModal from '../ReportLocationModal/ReportLocationModal'

type LocationProps = {
	location: {
		id: number
		name: string
		address: string
		sport: string
		description: string
		hourlyRate: number
		openingTime: string
		closingTime: string
		image: string
	}
}

const LocationComponent: React.FC<LocationProps> = ({ location }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [showReportModal, setShowReportModal] = useState(false)

	const handleOpenModal = () => {
		setIsModalOpen(true)
	}

	const handleCloseReport = () => {
		setShowReportModal(false)
	}

	return (
		<>
			<div className="location-box" onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
				<div className="location-image-container">
					<img
						src={
							location.image ||
							'https://www.indfloor.ro/wp-content/uploads/2021/07/DJI_0467.jpg'
						}
						alt={`${location.name} Header`}
						className="location-header-image"
					/>
					<div
						className="report-location"
						onClick={e => {
							e.stopPropagation()
							setShowReportModal(true)
						}}
					>
						<MdOutlineReportProblem size={30} />
					</div>
				</div>
				<div className="location-content">
					<div className="location-header">
						<h3 className="location-title">{location.name}</h3>
						<div className="location-stars">{'⭐'.repeat(5)}</div>
					</div>
					<p className="location-description">{location.description}</p>
					<div className="location-price">{location.hourlyRate} RON / hour</div>
					<div className="location-details">
						<p>
							<strong>Sport:</strong> {location.sport}
						</p>
						<p>
							<strong>Address:</strong> {location.address}
						</p>
						<p>
							<strong>Opening Time:</strong> {location.openingTime}
						</p>
						<p>
							<strong>Closing Time:</strong> {location.closingTime}
						</p>
					</div>
				</div>
			</div>
			{showReportModal && (
				<ReportLocationModal
					close={handleCloseReport}
					locationId={location.id}
					locationName={location.name}
				/>
			)}

			{isModalOpen && (
				<LocationReservationModal
					location={{
						id: location.id,
						name: location.name,
						description: location.description,
						stars: 5, // Assuming a default value for stars
						address: location.address,
						sport: location.sport,
						openingTime: location.openingTime,
						closingTime: location.closingTime,
						image: location.image,
						pricePerHour: location.hourlyRate,
					}}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</>
	)
}

export default LocationComponent
