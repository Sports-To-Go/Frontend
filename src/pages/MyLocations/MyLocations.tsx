import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useParams } from 'react-router-dom'
import { Location } from '../Locations/Locations'
import LocationComponent from '../../components/LocationComponent/LocationComponent'
import { auth } from '../../firebase/firebase'
import axios from 'axios'
import { BACKEND_URL } from '../../../integration-config'

const MyLocations: React.FC = () => {
	const { uid } = useParams()
	const [userLocations, setUserLocations] = useState<Location[]>([])
	const [isSameUser, setIsSameUser] = useState(false)
	useEffect(() => {
		const getUserLocations = async () => {
			const currentUser = auth.currentUser
			if (!currentUser) return
			setIsSameUser(currentUser.uid === uid)
			try {
				const token = await currentUser.getIdToken(true)
				const res = await axios.get(`http://${BACKEND_URL}/locations/${uid}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				setUserLocations(res.data)
			} catch (e) {
				console.error(e)
			}
		}
		getUserLocations()
	}, [uid])

	const filterAfterDelete = (id: number) => {
		setUserLocations(userLocations.filter(location => location.id !== id))
	}

	if (!uid) return

	return (
		<Layout>
			<div>
				{userLocations.length === 0 ? (
					<h2>No locations</h2>
				) : (
					userLocations.map(location => (
						<LocationComponent
							key={location.id}
							location={location}
							isSameUser={isSameUser}
							deleteLocationFromArr={filterAfterDelete}
						/>
					))
				)}
			</div>
		</Layout>
	)
}

export default MyLocations
