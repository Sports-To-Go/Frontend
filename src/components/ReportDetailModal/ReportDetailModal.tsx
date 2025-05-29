import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import './ReportDetailModal.scss'
import ReportCardInfo from '../ReportCardInfo/ReportCardInfo'
import { auth } from '../../firebase/firebase'
import axios from 'axios'
import { BACKEND_URL } from '../../../integration-config'
import { useAuth } from '../../context/UserContext'

export interface modalReportProps {
	name: string
	id: string
	type: 'User' | 'Location' | 'Group'
	close?: () => void
	removeReport: (id: string) => void
}

interface repsonseReports {
	reportedBy: string
	reason: string
	createdAt: string
}

const ReportDetailModal: React.FC<modalReportProps> = ({ removeReport, close, name, id, type }) => {
	const [reports, setReports] = useState<repsonseReports[]>()
	const [isLoading, setIsLoading] = useState(true)
	const [numberOfDaysBan, setNumberOfDaysBan] = useState<number>(0)
	const { user } = useAuth()
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

	const banUser = async () => {
		const currentUser = auth.currentUser
		if (!currentUser) return
		try {
			const token = await currentUser.getIdToken(true)
			axios.post(
				`http://${BACKEND_URL}/admin/bans`,
				{
					idUser: id,
					beginTime: new Date().toISOString().split('T')[0],
					duration: numberOfDaysBan,
					reason: 'Offensive player',
					bannedBy: user!.displayName,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
		} catch (error) {
			console.error(error)
		}
		removeReport(id)
		close!()
	}

	const forgiveUser = async () => {
		const currentUser = auth.currentUser
		if (!currentUser) return
		try {
			const token = await currentUser.getIdToken(true)
			axios.delete(`http://${BACKEND_URL}/admin/reports/${type}/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		} catch (error) {
			console.error(error)
		}
		removeReport(id)
		close!()
	}

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
						<button className="ban-user" onClick={banUser}>
							Ban
						</button>
						<input
							required
							type="number"
							min={2}
							placeholder="Number of days"
							onChange={event => setNumberOfDaysBan(Number(event.target.value))}
						/>
					</div>
					<button className="forgive-user" onClick={forgiveUser}>
						Forgive
					</button>
				</div>
			</dialog>
		</div>
	)
}

export default ReportDetailModal
