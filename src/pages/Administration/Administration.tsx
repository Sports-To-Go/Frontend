import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import './Administration.scss'
import AdminTable, { adminTableRow } from '../../components/AdminTable/AdminTable'
import '../../components/StatCards/StatCards.scss'
import StatCardsContainer from '../../components/StatCards/StatCards'
import AdminTab from '../../components/AdminTabs/AdminTab'
import { LineChart } from '@mui/x-charts/LineChart'
import AdminError from '../AdminError/AdminError'
import Bugs from '../../components/Bugs/Bugs'
import { auth } from '../../firebase/firebase'
import axios from 'axios'
import { BACKEND_URL } from '../../../integration-config'

export const Administration: React.FC = () => {
	const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>([])
	const [isMobile, setIsMobile] = useState(window.innerWidth < 1000)
	const [pass, setPass] = useState('')
	const [reports, setReports] = useState<adminTableRow[]>([])

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 1000)
		}

		const getMonthlyRevenue = async () => {
			const currentUser = auth.currentUser
			if (!currentUser) return
			const year = new Date().toISOString().split('T')[0].split('-')[0]
			try {
				const token = await currentUser.getIdToken(true)
				setPass(token)
				const res = await axios.get(`http://${BACKEND_URL}/admin/revenue/monthly`, {
					params: {
						from: `${year}-01-01`,
						to: `${year}-12-31`,
					},
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				const monthly: number[] = Array(12).fill(0)

				if (!!res.data) {
					res.data.forEach((rev: any) => {
						const month = new Date(rev.periodStart).getMonth()
						monthly[month] = rev.totalAmount
					})
				}
				setMonthlyRevenue(monthly)
			} catch (error) {
				console.error(error)
			}
		}

		const getReports = async () => {
			const currentUser = auth.currentUser
			if (!currentUser) return

			try {
				const token = await currentUser.getIdToken(true)
				const res = await axios.get(`http://${BACKEND_URL}/admin/reports/info`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				console.log(res.data)
				setReports(res.data)
			} catch (error) {
				console.error(error)
			}
		}

		getReports()
		getMonthlyRevenue()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const tableHeadersMap: { [key: string]: string[] } = {
		Venues: ['Venue', 'Name', 'Type', 'Reports'],
		Users: ['User', 'Name', 'Type', 'Reports'],
		//Groups: ['Group', 'Name', 'Type', 'Members'],
	}

	const tableDataMap: { [key: string]: any[] } = {
		Venues: reports.filter(report => report.type === 'Location'),
		Users: reports.filter(report => report.type === 'User'),
		//Groups: groups,
	}
	const [manageTitle, setManageTitle] = useState('Venues')

	if (isMobile) {
		return <AdminError />
	}

	return (
		<Layout showTabs={false} showFooter={true}>
			<div className="administration--container">
				<h2>Admin dashboard</h2>
				<p>{pass}</p>
				<div className="admin-cards--container">
					<StatCardsContainer />
				</div>
				<div className="manage--container">
					<div className="admin-tabs--container">
						{['Venues', 'Users', 'Analytics', 'Bugs'].map(tab => (
							<AdminTab
								key={tab}
								label={`Manage ${tab}`}
								active={manageTitle === tab}
								onClick={() => setManageTitle(tab)}
							/>
						))}
					</div>

					<div className="admin-table--container">
						<div style={{ width: '90%' }}>
							<h2>Manage {manageTitle}</h2>
						</div>

						{manageTitle === 'Analytics' ? (
							<LineChart
								xAxis={[
									{
										scaleType: 'band',
										data: [
											'January',
											'February',
											'March',
											'April',
											'May',
											'June',
											'July',
											'August',
											'September',
											'October',
											'November',
											'December',
										],
										label: 'Monthly Income',
									},
								]}
								series={[
									{
										data: monthlyRevenue,
									},
								]}
								height={350}
								width={800}
							/>
						) : manageTitle === 'Bugs' ? (
							<Bugs />
						) : (
							<AdminTable
								header={tableHeadersMap[manageTitle]}
								rows={tableDataMap[manageTitle]}
							/>
						)}
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default Administration
