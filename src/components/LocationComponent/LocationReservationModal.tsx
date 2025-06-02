import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/UserContext'
import { toast } from 'react-toastify'
import './LocationReservationModal.scss'
import { BACKEND_URL } from '../../../integration-config'
import axios from 'axios'
import { auth } from '../../firebase/firebase'
import PaymentModal from '../../pages/PaymentModal/PaymentModal'

type Props = {
	location: {
		id: number
		name: string
		description: string
		stars: number
		address: string
		sport: string
		pricePerHour: number
		image: string
		openingTime: string
		closingTime: string
	}
	onClose: () => void
}

type ExistingReservation = {
	startTime: string // "HH:mm"
	endTime: string
	date: string // "YYYY-MM-DD"
}

interface groupInterface {
	id: number
	name: string
	description: string
}

const LocationReservationModal: React.FC<Props> = ({ location, onClose }) => {
	const [showPayment, setShowPayment] = useState(false)
	const [date, setDate] = useState('')
	const [startTime, setStartTime] = useState('')
	const [endTime, setEndTime] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)
	const [existingReservations, setExistingReservations] = useState<ExistingReservation[]>([])
	const [groups, setGroups] = useState<groupInterface[]>([])
	const [selectedGroupId, setSelectedGroupId] = useState('')
	const [finalAmount, setFinalAmount] = useState(0)
	const { user } = useAuth()

	useEffect(() => {
		if (!date) return

		const fetchReservations = async () => {
			try {
				const response = await fetch(
					`http://${BACKEND_URL}/reservations?locationId=${location.id}`,
				)
				const data = await response.json()
				const filtered = data.filter((res: any) => res.date === date)
				setExistingReservations(filtered)
			} catch (err) {
				console.error('Error fetching reservations:', err)
			}
		}

		fetchReservations()
	}, [date, location.id])

	useEffect(() => {
		if (!user) return
		const uId = user.uid
		const currentUser = auth.currentUser
		if (!currentUser) return

		const getUserGroups = async () => {
			try {
				const token = await currentUser.getIdToken(true)
				const res = await axios.get(`http://${BACKEND_URL}/social/not-basic`, {
					params: { uid: uId },
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				setGroups(res.data)
			} catch (err) {
				console.error(err)
			}
		}
		getUserGroups()
	}, [user])

	const hasOverlap = () => {
		if (!date || !startTime || !endTime) return false

		return existingReservations.some(res => {
			return res.date === date && !(endTime <= res.startTime || startTime >= res.endTime)
		})
	}

	const isValid = () => {
		if (!date || !startTime || !endTime) return false
		if (startTime >= endTime) return false
		if (!selectedGroupId) return false
		if (hasOverlap()) return false
		return true
	}

	const calculateHours = () => {
		const [startH, startM] = startTime.split(':').map(Number)
		const [endH, endM] = endTime.split(':').map(Number)
		const start = startH * 60 + startM
		const end = endH * 60 + endM
		return Math.max(0, Math.ceil((end - start) / 60))
	}

	const handleSubmit = () => {
		if (!user) {
			toast.error('You must be logged in to make a reservation.')
			return
		}
		const hours = calculateHours()
		const estimatedRON = hours * location.pricePerHour
		const estimatedCost = Math.round(estimatedRON * 100)

		setFinalAmount(estimatedCost)
		setShowPayment(true)

		setShowPayment(true)
	}

	const handlePaymentSuccess = async () => {
		setShowPayment(false)
		setIsSubmitting(true)

		const payload = {
			locationId: location.id,
			userId: user!.uid,
			groupId: Number(selectedGroupId),
			calendarEventId: Date.now().toString(),
			date,
			startTime,
			endTime,
		}

		try {
			const response = await fetch(`http://${BACKEND_URL}/reservations`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})

			if (!response.ok) throw new Error(await response.text())

			setShowSuccess(true)
			setTimeout(() => {
				setShowSuccess(false)
				onClose()
			}, 2000)
		} catch (error) {
			toast.error(`Failed to book: ${(error as Error).message}`)
		} finally {
			setIsSubmitting(false)
		}
	}

	const hours = isValid() ? calculateHours() : 0
	const estimatedRON = hours * location.pricePerHour

	return (
		<div className="reservation-overlay" onClick={onClose}>
			<div className="reservation-modal" onClick={e => e.stopPropagation()}>
				<div className="reservation-grid">
					{/* Left: Image & Info */}
					<div className="reservation-left">
						<img
							src={
								location.image ||
								'https://www.indfloor.ro/wp-content/uploads/2021/07/DJI_0467.jpg'
							}
							alt={location.name}
							className="reservation-image"
						/>
						<h2>{location.name}</h2>
						<p className="location-description">{location.description}</p>
						<p className="location-stars">{'⭐'.repeat(location.stars)}</p>
						<p className="price">{location.pricePerHour} RON / hour</p>
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

					{/* Right: Reservation form */}
					<div className="reservation-right">
						<label>Pick a date:</label>
						<input type="date" value={date} onChange={e => setDate(e.target.value)} />
						<label>Start time:</label>
						<input
							type="time"
							value={startTime}
							onChange={e => setStartTime(e.target.value)}
						/>
						<label>End time:</label>
						<input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
						{!isValid() && <p className="error-msg">Please enter a valid time range</p>}
						<label>Select a group: </label>
						<select
							name="group-select"
							value={selectedGroupId}
							onChange={e => setSelectedGroupId(e.target.value)}
						>
							<option value="" disabled>
								Select a group
							</option>
							{groups.map(group => (
								<option key={group.id} value={group.id}>
									{group.name}
								</option>
							))}
						</select>
						{hasOverlap() && (
							<div className="time-overlap-msg">
								This time slot is already booked. Please choose another.
							</div>
						)}

						{existingReservations.length > 0 && (
							<div className="booked-intervals">
								<p>
									<strong>Booked slots:</strong>
								</p>
								{existingReservations.map((res, idx) => (
									<p key={idx}>
										{res.startTime} – {res.endTime}
									</p>
								))}
							</div>
						)}

						<div className="reservation-buttons">
							<button
								className="reserve-button"
								disabled={!isValid() || isSubmitting}
								onClick={handleSubmit}
							>
								{isSubmitting ? 'Booking...' : 'Book Now'}
							</button>
							<button className="close-button" onClick={onClose}>
								Close
							</button>
						</div>
						{isValid() && (
							<div className="reservation-summary">
								<h4>Summary</h4>
								<p>
									<strong>Date:</strong> {date}
								</p>
								<p>
									<strong>From:</strong> {startTime}
								</p>
								<p>
									<strong>To:</strong> {endTime}
								</p>
								<p>
									<strong>Hours:</strong> {hours}
								</p>
								<p>
									<strong>Estimated cost:</strong> {estimatedRON} RON
								</p>
							</div>
						)}
					</div>
				</div>
				{showPayment && (
					<PaymentModal
						onClose={() => setShowPayment(false)}
						onSuccess={handlePaymentSuccess}
						amount={finalAmount}
					/>
				)}

				{showSuccess && (
					<div className="success-overlay">
						<div className="checkmark">✔</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default LocationReservationModal
