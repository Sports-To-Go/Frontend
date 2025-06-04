import React, { useEffect, useState } from 'react'
import './AdminTable.scss'
import { FaChevronDown } from 'react-icons/fa'
import ReportDetailModal, { modalReportProps } from '../ReportDetailModal/ReportDetailModal'
import { Link } from 'react-router'
import axios from 'axios'
import { auth } from '../../firebase/firebase'
import { BACKEND_URL } from '../../../integration-config'
import NoData from '../NoData/NoData'

export interface adminTableRow {
	name?: string
	id: string
	type: 'User' | 'Location' | 'Group'
	reports: number
	imageUrl?: string // 👈 new field
}

interface adminTableProps {
	header: string[]
	rows: adminTableRow[]
}

const AdminTable: React.FC<adminTableProps> = ({ header, rows }) => {
	const [showModal, setShowModal] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [modalData, setModalData] = useState<modalReportProps>()
	const [tableRows, setTableRows] = useState<adminTableRow[]>([])

	useEffect(() => {
		setIsLoading(true)
		setTableRows(rows)

		const fetchNames = async () => {
			const currentUser = auth.currentUser
			if (!currentUser) {
				setIsLoading(false)
				return
			}
			try {
				const token = await currentUser.getIdToken(true)
				const updated = await Promise.all(
					rows.map(async row => {
						try {
							const res = await axios.get<{ name: string; imageUrl?: string }>(
								`http://${BACKEND_URL}/admin/${row.id}/${row.type}/name`,
								{ headers: { Authorization: `Bearer ${token}` } },
							)
							return { ...row, name: res.data.name, imageUrl: res.data.imageUrl }
						} catch (err) {
							console.error('Failed to fetch name for', row, err)
							return { ...row, name: '—', imageUrl: undefined }
						}
					}),
				)

				setTableRows(updated)
			} finally {
				setTimeout(() => setIsLoading(false), 500)
			}
		}

		fetchNames()
	}, [rows])

	const minBookings = 0
	const maxBookings = 100
	const getBookingColor = (value: number): string => {
		const ratio = (value - minBookings) / (maxBookings - minBookings)
		const red = Math.round(255 * (1 - ratio))
		const green = Math.round(200 * ratio)
		return `rgb(${red}, ${green}, 100)`
	}

	const removeReport = (id: string) => {
		setTableRows(prev => prev.filter(r => r.id !== id))
	}

	const openModal = (name: string, id: string, type: 'User' | 'Location' | 'Group') => {
		setModalData({ name, id, type, removeReport })
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

	if (tableRows.length === 0) {
		return <NoData>No data found...</NoData>
	}

	return (
		<div className="admin-table-wrapper">
			{showModal && (
				<ReportDetailModal
					name={modalData!.name}
					id={modalData!.id}
					type={modalData!.type}
					removeReport={modalData!.removeReport}
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
					{tableRows.map(({ name, id, type, reports, imageUrl }) => (
						<tr key={id}>
							<td>
								{type === 'User' ? (
									<Link to={`/profile/${id}`} style={{ cursor: 'pointer' }}>
										<span>View profile</span>
									</Link>
								) : imageUrl ? (
									<img
										src={imageUrl}
										alt={`${name} preview`}
										style={{
											width: '50px',
											height: '35px',
											objectFit: 'cover',
											borderRadius: '4px',
										}}
									/>
								) : (
									<span>No image</span>
								)}
							</td>
							<td>{name}</td>
							<td>{type}</td>
							<td style={{ color: getBookingColor(reports) }}>{reports}</td>
							<td>
								<div style={{ position: 'relative' }}>
									<FaChevronDown
										style={{ cursor: 'pointer' }}
										onClick={() => openModal(name!, id, type)}
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
