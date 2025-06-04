import React, { useState, useEffect, useRef } from 'react'
import LocationMap from '../../components/LocationMap/LocationMap'
import SportSelect from '../../components/SportSelect/SportSelect'
import { reverseGeocode, getDistanceInMeters } from '../../utils/geocode'
import { FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './AddLocationPage.scss'
import Layout from '../../components/Layout/Layout'
import { toast } from 'react-toastify'
import { auth } from '../../firebase/firebase'

type FormErrors = {
	courtName?: string
	sport?: string
	description?: string
	price?: string
	address?: string
	images?: string
	time?: string
}

const AddLocationPage: React.FC<{}> = () => {
	const [courtName, setCourtName] = useState('')
	const [sport, setSport] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState('')
	const [startTime, setStartTime] = useState('00:00')
	const [endTime, setEndTime] = useState('00:00')
	const [images, setImages] = useState<File[]>([])
	const [address, setAddress] = useState('')
	const [lat, setLat] = useState(47.1517)
	const [lng, setLng] = useState(27.5879)
	const [initialCoords, setInitialCoords] = useState<{ lat: number; lng: number } | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [imagePreviews, setImagePreviews] = useState<string[]>([])
	const [errors, setErrors] = useState<Record<string, string>>({})
	const navigate = useNavigate()
	const currentUser = auth.currentUser

	const handleAddressSelect = (coords: { lat: number; lng: number }) => {
		setLat(coords.lat)
		setLng(coords.lng)
		setInitialCoords(coords)
	}

	const handlePinMoved = async (coords: { lat: number; lng: number }) => {
		const distance = initialCoords ? getDistanceInMeters(initialCoords, coords) : Infinity

		if (distance > 50) {
			try {
				const newAddress = await reverseGeocode(coords.lat, coords.lng)
				if (newAddress) {
					setAddress(newAddress)
				}
			} catch (err) {
				console.error('reverseGeocode failed:', err)
			}

			setInitialCoords(coords)
		}

		setLat(coords.lat)
		setLng(coords.lng)
	}
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newFiles = Array.from(e.target.files || [])
		const totalFiles = images.length + newFiles.length

		if (totalFiles > 10) {
			setErrors(prev => ({
				...prev,
				images: 'You can upload a maximum of 10 images.',
			}))

			// Clear the error after 3 seconds
			setTimeout(() => {
				setErrors(prev => {
					const newErrors = { ...prev }
					delete newErrors.images
					return newErrors
				})
			}, 3000)

			return
		}

		const updatedImages = [...images, ...newFiles]
		setImages(updatedImages)

		const newPreviews = newFiles.map(file => URL.createObjectURL(file))
		setImagePreviews(prev => [...prev, ...newPreviews])

		// Clear the error if it was set
		setErrors(prev => {
			const newErrors = { ...prev }
			delete newErrors.images
			return newErrors
		})

		e.target.value = ''
	}

	const handleRemoveImage = (indexToRemove: number) => {
		setImages(prev => prev.filter((_, index) => index !== indexToRemove))
		setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove))
	}
	// <-- NEW useEffect JUST FOR CLEANUP -->
	useEffect(() => {
		return () => {
			imagePreviews.forEach(url => URL.revokeObjectURL(url))
		}
	}, [imagePreviews])
	const validate = (): boolean => {
		const newErrors: FormErrors = {}

		if (!courtName.trim()) {
			newErrors.courtName = 'Court Name is required'
		}
		if (!sport) {
			newErrors.sport = 'Please select a sport'
		}
		if (!description.trim()) {
			newErrors.description = 'Description is required'
		}
		if (!price.trim()) {
			newErrors.price = 'Price per hour is required'
		}
		if (!address.trim()) {
			newErrors.address = 'Address is required'
		}
		if (images.length === 0) {
			newErrors.images = 'At least one photo is required'
		}

		setErrors(newErrors)
		// If there are errors, return false
		return Object.keys(newErrors).length === 0
	}
	const clearError = (field: keyof FormErrors) =>
		setErrors(prev => {
			const next = { ...prev }
			delete next[field]
			return next
		})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validate()) return

		const payload = {
			name: courtName,
			address,
			longitude: lng,
			latitude: lat,
			createdBy: currentUser!.uid,
			description,
			sport,
			calendarId: 'cID',
			hourlyRate: parseFloat(price),
			openingTime: startTime,
			closingTime: endTime,
		}

		try {
			console.log('payload', payload)
			const response = await fetch('http://localhost:8081/locations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			})

			if (!response.ok) {
				throw new Error('Failed to submit')
			}

			toast.success('Court added successfully!')
			setTimeout(() => {
				navigate('/locations')
			}, 3000)
		} catch (error) {
			console.error('Error submitting form:', error)
		}
	}

	return (
		<Layout>
			<>
				{
					<>
						<h2 id="title">Add a new sports court</h2>
						<div className="add-location-form">
							<Link to="/locations" className="cancel-btn">
								<FaTimes size={20} />
							</Link>

							<h2 id="form-title">Courts Details</h2>

							<form onSubmit={handleSubmit} className="location-form">
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
												onChange={e => {
													setCourtName(e.target.value)
													clearError('courtName')
												}}
											/>
											{errors.courtName && <p className="error">{errors.courtName}</p>}
										</div>

										<div className="form-group">
											<label>Sport</label>
											<SportSelect
												value={sport}
												onChange={val => {
													setSport(val)
													clearError('sport')
												}}
												className="form-select-sport"
											/>
											{errors.sport && <p className="error">{errors.sport}</p>}
										</div>

										<div className="form-group">
											<label>Description</label>
											<textarea
												placeholder="Ex: Synthetic turf, up to 10 players, night lights, changing rooms and parking available."
												value={description}
												onChange={e => {
													setDescription(e.target.value)
													clearError('description')
												}}
											/>
											{errors.description && (
												<p className="error">{errors.description}</p>
											)}
										</div>

										<div className="form-row">
											<div className="form-group">
												<label>Price per hour</label>
												<input
													type="text"
													placeholder="e.g. 200 RON"
													value={price}
													onChange={e => {
														setPrice(e.target.value)
														clearError('price')
													}}
												/>
												{errors.price && <p className="error">{errors.price}</p>}
											</div>

											<div className="form-group">
												<label>Availability</label>
												<div className="time-selection">
													<input
														type="time"
														value={startTime}
														onChange={e => {
															setStartTime(e.target.value)
															clearError('time')
														}}
													/>
													<input
														type="time"
														value={endTime}
														onChange={e => {
															setEndTime(e.target.value)
															clearError('time')
														}}
													/>
												</div>
												{errors.time && <p className="error">{errors.time}</p>}
											</div>
										</div>
									</div>
									{/* Right Column: Map and Upload Images */}
									<div className="form-right">
										<div className="form-group map-section">
											<label htmlFor="address">Where's your place located?</label>
											<LocationMap
												address={address}
												onAddressChange={val => {
													setAddress(val)
													clearError('address')
												}}
												onAddressSelect={handleAddressSelect}
												onPinMoved={handlePinMoved}
												lat={lat}
												lng={lng}
											/>
											{errors.address && <p className="error">{errors.address}</p>}
										</div>

										{/* Upload images */}
										<div className="form-group">
											<label>Upload Images (up to 10 photos)</label>
											<div
												className="image-upload-box"
												onClick={() => fileInputRef.current?.click()}
											>
												<span className="plus-sign">+</span>
												<input
													type="file"
													accept="image/*"
													multiple
													ref={fileInputRef}
													style={{ display: 'none' }}
													onChange={e => {
														handleImageChange(e)
														clearError('images')
													}}
												/>
												{errors.images && <p className="error">{errors.images}</p>}
											</div>
										</div>
										<div className="image-preview-container">
											{imagePreviews.map((src, index) => (
												<div key={index} className="image-preview-wrapper">
													<img
														src={src}
														alt={`Preview ${index + 1}`}
														className="image-preview"
													/>
													<button
														type="button"
														className="remove-button"
														onClick={() => handleRemoveImage(index)}
													>
														×
													</button>
												</div>
											))}
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
				}
			</>
		</Layout>
	)
}
export default AddLocationPage
