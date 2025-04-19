import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import './Administration.scss'
import AdminTable from '../../components/AdminTable/AdminTable'
import { tableData } from '../../assets/dummy-data'
import '../../components/StatCards/StatCards.scss'
import StatCard from '../../components/StatCards/StatCards'

export const Administration: React.FC = () => {
	const headerTable = ['Venue', 'Name', 'Type', 'Status', 'Bookings', 'Ratings']
	const [manageTitle, setManageTitle] = useState('Venues')
	const cards = [
		{ id: 'bookings', title: 'Total', subtitle: 'Bookings', value: '367' },
		{ id: 'venues', title: 'Active', subtitle: 'Venues', value: '10' },
		{ id: 'new-users', title: 'New', subtitle: 'Users', value: '14' },
		{ id: 'total-users', title: 'Total', subtitle: 'Users', value: '1.340' },
		{ id: 'revenue', title: 'Revenue', subtitle: 'This Month', value: '$2.786' }
	  ];

	return (
		<Layout showTabs={false} showFooter={true}>
			<div className="administration--container">
				<h2>Admin dashboard</h2>
				<div className="admin-cards--container">
				<div className="stats-grid">
            		{cards.map((card) => (
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
