import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import './Administration.scss'
import AdminTable from '../../components/AdminTable/AdminTable'
import { tableData } from '../../assets/dummy-data'

export const Administration: React.FC = () => {
	const headerTable = ['Venue', 'Name', 'Type', 'Status', 'Bookings', 'Ratings']
	const [manageTitle, setManageTitle] = useState('Venues')

	return (
		<Layout showTabs={false} showFooter={true}>
			<div className="administration--container">
				<h2>Admin dashboard</h2>
				<div className="admin-cards--container">To be implemented</div>
				<div className="manage--container">
					<div className="admin-tabs--container">To be implemented</div>
					<div className="admin-table--container">
						<div style={{ width: '90%' }}>
							<h2>Manage {manageTitle}</h2>
						</div>
						<AdminTable header={headerTable} rows={tableData} />
					</div>
				</div>
			</div>
		</Layout>
	)
}
