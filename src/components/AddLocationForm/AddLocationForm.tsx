import React, { useState, useEffect } from 'react'
import LocationMap from '../LocationMap/LocationMap'
import { reverseGeocode, getDistanceInMeters } from '../../utils/geocode'
import { FaTimes } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import './AddLocationForm.scss'

type AddLocationFormProps = {
	onCancel: () => void
}

const AddLocationForm: React.FC<AddLocationFormProps> = ({ onCancel }) => {
	const [courtName, setCourtName] = useState('')
	const [sport, setSport] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState('')
	const [startTime, setStartTime] = useState('00:00')
	const [endTime, setEndTime] = useState('00:00')
	const [images, setImages] = useState<File[]>([])
	const [showForm, setShowForm] = useState(true)
	const [address, setAddress] = useState('')
	const [lat, setLat] = useState(47.1517)
	const [lng, setLng] = useState(27.5879)
	const [initialCoords, setInitialCoords] = useState<{ lat: number; lng: number } | null>(null)

	const location = useLocation()
	const navigate = useNavigate()

	// Reset form visibility when navigating to /profile/locations
	useEffect(() => {
		if (location.pathname === '/profile/locations') {
			setShowForm(true)
		}
	}, [location])

	// Handle file upload
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || [])
		setImages(files)
	}

	const handleAddressSelect = (coords: { lat: number; lng: number }) => {
		setLat(coords.lat)
		setLng(coords.lng)
		setInitialCoords(coords)
	}

	const handlePinMoved = async (coords: { lat: number; lng: number }) => {
		const distance = initialCoords ? getDistanceInMeters(initialCoords, coords) : Infinity

		if (distance > 200) {
			const newAddress = await reverseGeocode(coords.lat, coords.lng)
			if (newAddress) {
				setAddress(newAddress)
			}
			setInitialCoords(coords) // <- actualizează poziția de referință!
		}

		setLat(coords.lat)
		setLng(coords.lng)
	}

	return (
		<>
			{showForm && (
				<>
					<h2 id="title">Add a new sports court</h2>
					<div className="add-location-form">
						{/* Add a new h2 title*/}
						{/* Cancel button in the top right */}
						<button className="cancel-btn" onClick={onCancel}>
							<FaTimes size={20} />
						</button>

						<h2 id="form-title">Courts Details</h2>

						<form>
							{/* Container for two columns */}
							<div className="form-columns">
								{/* Left Column: Text-based inputs */}
								<div className="form-left">
									<div className="form-group">
										<label>Court Name</label>
										<input
											type="text"
											placeholder="Enter your court's name"
											value={courtName}
											onChange={e => setCourtName(e.target.value)}
										/>
									</div>

									<div className="form-group">
										<label>Sport</label>
										<select value={sport} onChange={e => setSport(e.target.value)}>
											<option value="">Select a sport</option>
											<option value="football">Football</option>
											<option value="tennis">Tennis</option>
											<option value="basketball">Basketball</option>
											{/* Additional sports options */}
										</select>
										{/* Aici se poate adăuga, eventual, o imagine reprezentativă pentru sport, de exemplu printr-un <img> conditionat */}
									</div>

									<div className="form-group">
										<label>Description</label>
										<textarea
											placeholder="Ex: Synthetic turf, up to 10 players, night lights, changing rooms and parking available."
											value={description}
											onChange={e => setDescription(e.target.value)}
										/>
									</div>

									<div className="form-group">
										<label>Price per hour</label>
										<input
											type="text"
											placeholder="e.g. 200 RON"
											value={price}
											onChange={e => setPrice(e.target.value)}
										/>
									</div>

									<div className="form-group">
										<label>Availability</label>
										<div className="time-selection">
											<input
												type="time"
												value={startTime}
												onChange={e => setStartTime(e.target.value)}
											/>
											<span>to</span>
											<input
												type="time"
												value={endTime}
												onChange={e => setEndTime(e.target.value)}
											/>
										</div>
									</div>
								</div>
								{/* Right Column: Map and Upload Images */}
								<div className="form-right">
									<div className="form-group map-section">
										<label htmlFor="address">Where's your place located?</label>
										<LocationMap
											address={address}
											onAddressChange={setAddress}
											onAddressSelect={handleAddressSelect}
											onPinMoved={handlePinMoved}
											lat={lat}
											lng={lng}
										/>
									</div>

									{/* Upload images */}
									<div className="form-group">
										<label>Upload Images (up to 10 photos)</label>
										<input
											type="file"
											multiple
											accept="image/*"
											onChange={handleFileChange}
										/>
										{/* Înlocuiește butonul implicit cu unul personalizat, conform designului */}
									</div>
								</div>
							</div>
							{/* Form buttons */}
							<div className="form-buttons">
								<button type="submit" className="publish-btn">
									Publish Court
								</button>
							</div>
						</form>
					</div>
				</>
			)}
		</>
	)
}
export default AddLocationForm
