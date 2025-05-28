import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import './ReportDetailModal.scss'
import ReportCardInfo from '../ReportCardInfo/ReportCardInfo'
import { auth } from '../../firebase/firebase'
import axios from 'axios'
import { BACKEND_URL } from '../../../integration-config'

export interface modalReportProps {
	name: string
	id: string
	type: 'User' | 'Location' | 'Group'
	close?: () => void
}

interface repsonseReports {
	reportedBy: string
	reason: string
	createdAt: string
}

const ReportDetailModal: React.FC<modalReportProps> = ({ close, name, id, type }) => {
	const [reports, setReports] = useState<repsonseReports[]>()
	const [isLoading, setIsLoading] = useState(true)
	useEffect(() => {
		const getReports = async () => {
			const currentUser = auth.currentUser
			if (!currentUser) return
			try {
				const token = await currentUser.getIdToken(true)

				const res = await axios.get(
					`http://${BACKEND_URL}/admin/reports/${type}/${id}/messages`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				)
				setReports(res.data)
			} catch (error) {
				console.error(error)
			} finally {
				setIsLoading(false)
			}
		}

		getReports()
	}, [])

	return (
		<div className="backdrop" onClick={close}>
			<dialog
				className="modal-reports"
				onClick={event => {
					event.stopPropagation()
				}}
			>
				<div className="modal--header">
					<h1>{name}'s reports</h1>
					<IoClose size={30} onClick={close} cursor={'pointer'} />
				</div>
				<div className="modal--body">
					{isLoading ? (
						<div className="bugs-container--loading">
							<div className="circle"></div>
						</div>
					) : (
						reports?.map(({ reason, reportedBy, createdAt }, index) => (
							<ReportCardInfo
								key={index}
								reportDate={createdAt}
								reportedBy={reportedBy}
								description={reason}
							/>
						))
					)}
				</div>
				<div className="modal--footer">
					<div className="ban--container">
						<button className="ban-user">Ban</button>
						<input type="number" min={2} placeholder="Number of days" />
					</div>
					<button className="forgive-user">Forgive</button>
				</div>
			</dialog>
		</div>
	)
}

export default ReportDetailModal
