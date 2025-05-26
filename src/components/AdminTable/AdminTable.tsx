import React, { useEffect, useState } from 'react'
import './AdminTable.scss'
import { FaChevronDown } from 'react-icons/fa'
import ReportDetailModal from '../ReportDetailModal/ReportDetailModal'

export interface adminTableRow {
	image: { url: string; alt: string }
	name: string
	type: string
	status: 'Active' | 'Inactive'
	bookings: number
	rating: number
}

interface adminTableProps {
	header: string[]
	rows: adminTableRow[]
}

const AdminTable: React.FC<adminTableProps> = ({ header, rows }) => {
	const [showModal, setShowModal] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		setTimeout(() => setIsLoading(false), 1500)
	}, [])

	const minBookings = 0
	const maxBookings = 100
	const getBookingColor = (value: number): string => {
		const ratio = (value - minBookings) / (maxBookings - minBookings)
		const red = Math.round(255 * (1 - ratio))
		const green = Math.round(200 * ratio)
		return `rgb(${red}, ${green}, 100)`
	}

	const openModal = () => {
		setShowModal(true)
	}

	const closeModal = () => {
		setShowModal(false)
	}

	if (isLoading)
		return (
			<div className="bugs-container--loading">
				<div className="circle"></div>
			</div>
		)

	return (
		<div className="admin-table-wrapper">
			{showModal && <ReportDetailModal name={'Misu'} close={closeModal} />}

			<table>
				<thead>
					<tr>
						{header.map((value, index) => (
							<td key={index}>{value}</td>
						))}
						<td>Take Action</td>
					</tr>
				</thead>
				<tbody>
					{rows.map(({ image, name, type, status, bookings, rating }, index) => (
						<tr key={index}>
							<td>
								<img src={image.url} alt={image.alt} />
							</td>
							<td>{name}</td>
							<td>{type}</td>
							<td>
								<div className={`status-adm ${status}`}>
									<div className={`circle-status ${status}`}></div>
									{status}
								</div>
							</td>
							<td style={{ color: getBookingColor(bookings) }}>{bookings}</td>
							<td>{rating}/5</td>
							<td>
								<div style={{ position: 'relative' }}>
									<FaChevronDown
										style={{ cursor: 'pointer' }}
										onClick={() => openModal()}
									/>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default AdminTable
