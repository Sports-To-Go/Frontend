import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout'
import './Administration.scss'
import AdminTable from '../../components/AdminTable/AdminTable'
import { groups, tableData, users } from '../../assets/dummy-data'
import '../../components/StatCards/StatCards.scss'
import StatCard from '../../components/StatCards/StatCards'
import AdminTab from '../../components/AdminTabs/AdminTab'
import { LineChart } from '@mui/x-charts/LineChart'

export const Administration: React.FC = () => {
	const navigate = useNavigate();
	const isMobile = window.innerWidth < 1000;

	const tableHeadersMap: { [key: string]: string[] } = {
		Venues: ['Venue', 'Name', 'Type', 'Status', 'Bookings', 'Ratings'],
		Users: ['User', 'Name', 'Type', 'Status', 'Reports', 'Rating'],
		Groups: ['Group', 'Name', 'Type', 'Status', 'Members', 'Created'],
		Analytics: ['I', 'do_not', 'know'],
		Bugs: ['Issue', 'Status', 'Reported By', 'Number of reports'],
	}

	const tableDataMap: { [key: string]: any[] } = {
		Venues: tableData,
		Users: users,
		Groups: groups,
		Analytics: [],
		Bugs: [],
	}
	const [manageTitle, setManageTitle] = useState('Venues')
	const cards = [
		{ id: 'bookings', title: 'Total', subtitle: 'Bookings', value: '367' },
		{ id: 'venues', title: 'Active', subtitle: 'Venues', value: '10' },
		{ id: 'new-users', title: 'New', subtitle: 'Users', value: '14' },
		{ id: 'total-users', title: 'Total', subtitle: 'Users', value: '1.340' },
		{ id: 'revenue', title: 'Revenue', subtitle: 'This Month', value: '$2.786' },
	]

	if (isMobile) {
		navigate('/admin-error', {
		  replace: true,
		  state: {
			title: 'Desktop Required',
			message: 'Admin dashboard requires a desktop or tablet in landscape mode'
		  }
		});
		return null;
	  }

	return (
		<Layout showTabs={false} showFooter={true}>
			<div className="administration--container">
				<h2>Admin dashboard</h2>
				<div className="admin-cards--container">
					<div className="stats-grid">
						{cards.map(card => (
							<StatCard
								key={card.id}
								title={card.title}
								subtitle={card.subtitle}
								value={card.value}
							/>
						))}
					</div>
				</div>
				<div className="manage--container">
					<div className="admin-tabs--container">
						{['Venues', 'Users', 'Groups', 'Analytics', 'Bugs'].map(tab => (
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
						{manageTitle !== 'Analytics' ? (
							<AdminTable
								header={tableHeadersMap[manageTitle]}
								rows={tableDataMap[manageTitle]}
							/>
						) : (
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
										data: [
											1200, 550.5, 2100, 800.5, 1601.5, 125.5, 1110, 2000, 1900, 1200,
											900, 110,
										],
									},
								]}
								height={350}
								width={800}
							/>
						)}
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default Administration;