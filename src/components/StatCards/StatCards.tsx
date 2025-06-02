import React, { useEffect, useState } from 'react'
import './StatCards.scss'
import axios from 'axios'
import { BACKEND_URL } from '../../../integration-config'
import { auth } from '../../firebase/firebase'

interface StatCardProps {
	title: string
	subtitle: string
	value: string
}

const StatCardComponent: React.FC<StatCardProps> = ({ title, subtitle, value }) => (
	<div className="stat-card">
		<div className="stat-header">
			<small>{title}</small>
			<h3>{subtitle}</h3>
		</div>
		<div className="stat-value">{value}</div>
	</div>
)

export const StatCardsContainer: React.FC = () => {
	const [stats, setStats] = useState<StatCardProps[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const fetchStats = async () => {
			const currentUser = auth.currentUser
			if (!currentUser) return
			try {
				// Fetch all statistics in parallel
				const token = await currentUser.getIdToken(true)
				const now = new Date()
				const year = now.getFullYear()
				const month = String(now.getMonth() + 1).padStart(2, '0')
				const lastDay = new Date(year, now.getMonth() + 1, 0)
				const lastDayStr = lastDay.toISOString().split('T')[0]

				const [locationsCountRes, reservationsCountRes, usersCount, currentMonthIncome] =
					await Promise.all([
						axios.get<number>(`http://${BACKEND_URL}/admin/locations/count`, {
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}),
						axios.get<number>(`http://${BACKEND_URL}/admin/reservations/count`, {
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}),
						axios.get<number>(`http://${BACKEND_URL}/admin/user/count`, {
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}),
						axios.get(`http://${BACKEND_URL}/admin/revenue/monthly`, {
							params: {
								from: `${year}-${month}-01`,
								to: lastDayStr,
							},
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}),
					])
				const totalAmount = currentMonthIncome.data.length
					? currentMonthIncome.data[0].totalAmount
					: 0
				// Transform the responses into StatCardProps format
				const statsData: StatCardProps[] = [
					{
						title: 'Locations',
						subtitle: 'Total Locations',
						value: locationsCountRes.data.toString(),
					},
					{
						title: 'Reservations',
						subtitle: 'Total Reservations',
						value: reservationsCountRes.data.toString(),
					},
					{
						title: 'New Users',
						subtitle: 'Registered Last Week',
						value: '0',
					},
					{ title: 'Total', subtitle: 'Users', value: usersCount.data.toString() },
					{
						title: 'Revenue',
						subtitle: 'This Month',
						value: !!totalAmount ? `${totalAmount.toString()}RON` : '0RON',
					},
				]

				setStats(statsData)
			} catch (err) {
				setError('Failed to load statistics')
				console.error('API Error:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchStats()
	}, [])

	if (loading) {
		return <div className="loading-message">Loading statistics...</div>
	}

	if (error) {
		return <div className="error-message">{error}</div>
	}

	return (
		<div className="stats-grid">
			{stats.map((stat, index) => (
				<StatCard
					key={`stat-${index}`}
					title={stat.title}
					subtitle={stat.subtitle}
					value={stat.value}
				/>
			))}
		</div>
	)
}

export const StatCard = StatCardComponent
export default StatCardsContainer
