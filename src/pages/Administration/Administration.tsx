import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import './Administration.scss'
import AdminTable from '../../components/AdminTable/AdminTable'
import { tableData } from '../../assets/dummy-data'
import '../../components/StatCards/StatCards.scss'
import StatCard from '../../components/StatCards/StatCards'
import AdminTab from '../../components/AdminTabs/AdminTab'

export const Administration: React.FC = () => {
	const tableHeadersMap: { [key: string]: string[] } = {
		Venues: ['Venue', 'Name', 'Type', 'Status', 'Bookings', 'Ratings'],
		Users: ['Name', 'Email', 'Account Creation Date'],
		Groups: ['Group Name', 'Members', 'Created'],
		Analytics: ['I', 'do_not', 'know'],
		Bugs: ['Issue', 'Status', 'Reported By', 'Number of reports'],
	}
	
	const tableDataMap: { [key: string]: any[] } = {
		Venues: tableData,
		Users: [],
		Groups: [],
		Analytics: [],
		Bugs: []
	}	
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
				<div className="admin-tabs--container">
					{['Venues', 'Users', 'Groups', 'Analytics', 'Bugs'].map((tab) => (
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
						<AdminTable
							header={tableHeadersMap[manageTitle]}
							rows={tableDataMap[manageTitle]}
						/>
					</div>
				</div>
			</div>
		</Layout>
	)
}
