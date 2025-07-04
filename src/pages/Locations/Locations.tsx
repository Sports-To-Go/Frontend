import { FC, useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import LocationComponent from '../../components/LocationComponent/LocationComponent'
import FilterBar from '../../components/FilterBar/FilterBar'
import './Locations.scss'
import axios from 'axios'
import { BACKEND_URL } from '../../../integration-config'
import NoData from '../../components/NoData/NoData'

export interface Location {
	id: number
	title: string
	name: string
	description: string
	address: string
	latitude: number
	longitude: number
	stars: number
	pricePerHour: string
	images: string[]
	sport: string
	hourlyRate: number
	openingTime: string
	closingTime: string
}

interface Filters {
	sport: string
	price: '' | 'ascending' | 'descending'
	startTime: string
	endTime: string
}

const Locations: FC = () => {
	const [filteredLocations, setFilteredLocations] = useState<Location[]>([])

	// Fetch locations from the backend API
	useEffect(() => {
		axios
			.get(`http://${BACKEND_URL}/locations`)
			.then(response => {
				const normalized = response.data.map((loc: any) => ({
					...loc,
					images: loc.imageUrls ?? [], // 👈 normalize imageUrls → images
				}))
				setFilteredLocations(normalized)
			})
			.catch(error => {
				console.error('Error fetching locations:', error)
			})
	}, [])

	// Handle filter changes
	const handleFilterChange = (newFilters: Filters) => {
		const params: any = {}
		if (newFilters.sport) params.sport = newFilters.sport
		if (newFilters.price) params.price = newFilters.price
		if (newFilters.startTime) params.start = newFilters.startTime
		if (newFilters.endTime) params.end = newFilters.endTime

		axios
			.get(`http://${BACKEND_URL}/locations/filter`, { params })
			.then(response => {
				const normalized = response.data.map((loc: any) => ({
					...loc,
					images: loc.imageUrls ?? [],
				}))
				setFilteredLocations(normalized)
			})
			.catch(error => {
				console.error('Error fetching filtered locations:', error)
			})
	}

	return (
		<Layout>
			<div className="locations-page">
				<FilterBar onFilterChange={handleFilterChange} />

				<div className="locations-grid">
					{filteredLocations.length === 0 ? (
						<div className="empty-place--container">
							<NoData>No locations found</NoData>
						</div>
					) : (
						filteredLocations.map(location => (
							<LocationComponent key={location.id} location={location} />
						))
					)}
				</div>
			</div>
		</Layout>
	)
}

export default Locations
