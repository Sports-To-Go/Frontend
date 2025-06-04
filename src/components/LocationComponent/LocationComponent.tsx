import React, { useState } from 'react'
import LocationReservationModal from '../LocationComponent/LocationReservationModal'
import { MdDeleteOutline, MdOutlineReportProblem } from 'react-icons/md'
import './LocationComponent.scss'
import ReportLocationModal from '../ReportLocationModal/ReportLocationModal'
import axios from 'axios'
import { BACKEND_URL } from '../../../integration-config'
import backgroundplaceholder from '../../assets/backgroundplaceholder.png'
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
		images: string[]
	}
	isSameUser?: boolean
	deleteLocationFromArr?: (id: number) => void
}

const LocationComponent: React.FC<LocationProps> = ({
	location,
	isSameUser = false,
	deleteLocationFromArr,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [showReportModal, setShowReportModal] = useState(false)

	const handleOpenModal = () => {
		setIsModalOpen(true)
	}

	const handleDeleteLocations = async () => {
		try {
			if (deleteLocationFromArr) {
				deleteLocationFromArr(location.id)
			}
			await axios.delete(`http://${BACKEND_URL}/locations/${location.id}`)
			console.log('Location deleted successfully')
		} catch (error) {
			console.error('Failed to delete location:', error)
		} finally {
			setShowDeleteModal(false)
		}
	}

	const handleCloseReport = () => {
		setShowReportModal(false)
	}

	return (
		<>
			<div className="location-box" onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
				<div className="location-image-container">
					<img
						src={location.images[0] || backgroundplaceholder}
						alt={`${location.name} Header`}
						className="location-header-image"
					/>
					{isSameUser ? (
						<div
							className="report-location"
							onClick={e => {
								e.stopPropagation()
								setShowDeleteModal(true)
							}}
						>
							<MdDeleteOutline size={30} />
						</div>
					) : (
						<div
							className="report-location"
							onClick={e => {
								e.stopPropagation()
								setShowReportModal(true)
							}}
						>
							<MdOutlineReportProblem size={30} />
						</div>
					)}
				</div>
				<div className="location-content">
					<div className="location-header">
						<h3 className="location-title">{location.name}</h3>
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
			{showDeleteModal && (
				<div className="reservation-overlay" onClick={() => setShowDeleteModal(false)}>
					<div className="delete-modal" onClick={e => e.stopPropagation()}>
						<h2>Are you sure?</h2>
						<div className="modal-buttons">
							<button className="delete-button" onClick={handleDeleteLocations}>
								Delete
							</button>
							<button className="cancel-button" onClick={() => setShowDeleteModal(false)}>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{!isSameUser && isModalOpen && (
				<LocationReservationModal
					location={{
						id: location.id,
						name: location.name,
						description: location.description,
						address: location.address,
						sport: location.sport,
						openingTime: location.openingTime,
						closingTime: location.closingTime,
						images: location.images,
						pricePerHour: location.hourlyRate,
					}}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</>
	)
}

export default LocationComponent
