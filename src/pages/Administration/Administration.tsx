import React from 'react'
import Layout from '../../components/Layout/Layout'
import './Administration.scss'

export const Administration: React.FC = () => {
	return (
		<Layout showTabs={false} showFooter={true}>
			<div className="administration--container">
				<h2>Admin dashboard</h2>
				<div className="admin-cards--container">To be implemented</div>
				<div className="manage--container">
					<div className="admin-tabs--container">To be implemented</div>
					<div className="admin-table--container">To be implemented</div>
				</div>
			</div>
		</Layout>
	)
}
