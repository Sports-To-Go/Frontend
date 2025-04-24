import React, { useState } from 'react'
import './AdminTable.scss'
import { FaChevronDown } from 'react-icons/fa'

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
	const minBookings = 0
	const maxBookings = 100
	const getBookingColor = (value: number): string => {
		const ratio = (value - minBookings) / (maxBookings - minBookings)
		const red = Math.round(255 * (1 - ratio))
		const green = Math.round(200 * ratio)
		return `rgb(${red}, ${green}, 100)`
	}

	const [openActions, setOpenActions] = useState<number | null>(null)
	const toggleActions = (index: number) => {
		setOpenActions(openActions === index ? null : index)
	}

	return (
		<div className="admin-table-wrapper">
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
								<div className="status-adm">
									<div className="circle-status"></div>
									{status}
								</div>
							</td>
							<td style={{ color: getBookingColor(bookings) }}>{bookings}</td>
							<td>{rating}/5</td>
							<td>
								<div style={{ position: 'relative' }}>
									<FaChevronDown
										style={{ cursor: 'pointer' }}
										onClick={() => toggleActions(index)}
									/>
									{openActions === index && (
										<div className="action-buttons">
											<button className="action-btn">Suspend</button>
											<button className="action-btn">Reject</button>
										</div>
									)}
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
