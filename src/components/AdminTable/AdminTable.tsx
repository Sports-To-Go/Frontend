import React, { useEffect, useState } from 'react'
import './AdminTable.scss'
import { FaChevronDown } from 'react-icons/fa'
import ReportDetailModal, { modalReportProps } from '../ReportDetailModal/ReportDetailModal'
import { Link } from 'react-router'

export interface adminTableRow {
	name?: string
	id: string
	type: 'User' | 'Location' | 'Group'
	reports: number
}

interface adminTableProps {
	header: string[]
	rows: adminTableRow[]
}

const AdminTable: React.FC<adminTableProps> = ({ header, rows }) => {
	const [showModal, setShowModal] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [modalData, setModalData] = useState<modalReportProps>()

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

	const openModal = (name: string, id: string, type: 'User' | 'Location' | 'Group') => {
		setModalData({ name: name, id: id, type: type })
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
			{showModal && (
				<ReportDetailModal
					name={modalData!.name}
					id={modalData!.id}
					type={modalData!.type}
					close={closeModal}
				/>
			)}

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
					{rows.map(({ name = 'proba', id, type, reports }, index) => (
						<tr key={index}>
							<td>
								{type === 'User' ? (
									<Link to={'/faq'} target="_blank" style={{ cursor: 'pointer' }}>
										View profile
									</Link>
								) : (
									<img src="https://i.pravatar.cc/100?u=5" alt="poza" />
								)}
							</td>
							<td>{name}</td>
							<td>{type}</td>

							<td style={{ color: getBookingColor(reports) }}>{reports}</td>
							<td>
								<div style={{ position: 'relative' }}>
									<FaChevronDown
										style={{ cursor: 'pointer' }}
										onClick={() => openModal(name, id, type)}
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
