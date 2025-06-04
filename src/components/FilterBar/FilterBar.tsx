import React, { useState, useRef } from 'react'
import './FilterBar.scss'

interface Filters {
	sport: string
	price: '' | 'ascending' | 'descending'
	startTime: string
	endTime: string
}

interface FilterBarProps {
	onFilterChange: (filters: Filters) => void
}

const sportsIcons = [
	{ id: 'Football', icon: '⚽' },
	{ id: 'Basketball', icon: '🏀' },
	{ id: 'Tennis', icon: '🎾' },
	{ id: 'Volleyball', icon: '🏐' },
	{ id: 'Table_Tennis', icon: '🏓' },
]

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
	const [localFilters, setLocalFilters] = useState<Filters>({
		sport: '',
		price: '',
		startTime: '',
		endTime: '',
	})
	const [showFiltersMenu, setShowFiltersMenu] = useState(false)
	const sportsIconsRef = useRef<HTMLDivElement>(null)

	const handleSportClick = (sport: string) => {
		const updatedFilters = {
			...localFilters,
			sport: localFilters.sport === sport ? '' : sport, // Toggle selected sport filter
		}
		setLocalFilters(updatedFilters)
		onFilterChange(updatedFilters)
	}

	const toggleFiltersMenu = () => {
		setShowFiltersMenu(prev => !prev)
	}

	const handleFilterChange = (key: keyof Filters, value: string) => {
		const updatedFilters = { ...localFilters, [key]: value }
		setLocalFilters(updatedFilters)
		onFilterChange(updatedFilters)
	}

	// Scroll sports icons left/right
	const scrollIcons = (direction: 'left' | 'right') => {
		const container = sportsIconsRef.current
		if (!container) return
		const scrollAmount = 80 // px, adjust for icon+gap width
		if (direction === 'left') {
			container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
		} else {
			container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
		}
	}

	return (
		<div className="filter-bar-container">
			<div className="filter-bar">
				<button
					className="arrow-button left"
					onClick={() => scrollIcons('left')}
					type="button"
					aria-label="Scroll sports left"
				>
					&lt;
				</button>

				<div className="sports-icons" ref={sportsIconsRef}>
					{sportsIcons.map(sport => (
						<button
							key={sport.id}
							className={`sport-icon ${localFilters.sport === sport.id ? 'active' : ''}`}
							onClick={() => handleSportClick(sport.id)}
							type="button"
						>
							{sport.icon}
						</button>
					))}
				</div>

				<button
					className="arrow-button right"
					onClick={() => scrollIcons('right')}
					type="button"
					aria-label="Scroll sports right"
				>
					&gt;
				</button>

				<button className="filters-button" onClick={toggleFiltersMenu} type="button">
					Filters
				</button>
			</div>

			{showFiltersMenu && (
				<div className="filters-menu">
					<button className="close-button" onClick={toggleFiltersMenu} type="button">
						X
					</button>
					<h3>Filters</h3>
					<div className="filters-options">
						<div>
							<p>Price</p>
							<select
								name="price"
								onChange={e => handleFilterChange('price', e.target.value)}
							>
								<option value="">Select order</option>
								<option value="ascending">Ascending</option>
								<option value="descending">Descending</option>
							</select>
						</div>
						<div className="time-row">
							<div className="filter-group">
								<p>Opening Time</p>
								<input
									type="time"
									onChange={e => handleFilterChange('startTime', e.target.value)}
								/>
							</div>
							<div className="filter-group">
								<p>Closing Time</p>
								<input
									type="time"
									onChange={e => handleFilterChange('endTime', e.target.value)}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default FilterBar
