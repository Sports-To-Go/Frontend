import React from 'react'
import './ActivityFeed.scss'
import ActivityItem from '../ActivityItem/ActivityItem'
import backgroundplaceholder from '../../assets/backgroundplaceholder.png'

const ActivityFeed: React.FC = () => {
	return (
		<div className="activity-feed">
			<h2 className="activity-feed__title">Recent Activity</h2>

			<div className="activity-feed__card">
				<div className="activity-feed__header">
					<p className="activity-feed__last-online">Last Online 2 days ago</p>
				</div>

				<div className="activity-feed__scroll-container">
					<ActivityItem
						image={backgroundplaceholder}
						title="Played at - TerenName - TerenLocation"
						time="2 hours"
						description="Very fun match! Weather was perfect and the location was great."
						rating={5}
					/>

					<ActivityItem
						image={backgroundplaceholder}
						title="Played at - Sala Sporturilor - Cluj"
						time="1 hour"
						description="Quick 3v3 match with friends!"
						rating={4}
					/>

					<ActivityItem
						image={backgroundplaceholder}
						title="Played at - Sala Sporturilor - Cluj"
						time="1 hour"
						description="Quick 3v3 match with friends!"
						rating={4}
					/>

					<ActivityItem
						image={backgroundplaceholder}
						title="Played at - Sala Sporturilor - Cluj"
						time="1 hour"
						description="Quick 3v3 match with friends!"
						rating={4}
					/>
				</div>
			</div>
		</div>
	)
}

export default ActivityFeed
