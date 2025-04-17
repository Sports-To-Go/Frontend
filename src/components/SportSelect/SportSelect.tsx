import { Listbox } from '@headlessui/react'
import React, { JSX } from 'react'
import './SportSelect.scss'

import footballIcon from '/src/assets/sports/football.svg'
import basketballIcon from '/src/assets/sports/basketball.svg'
import volleyballIcon from '/src/assets/sports/volleyball.svg'
import tennisIcon from '/src/assets/sports/tennis.svg'
import tableTennisIcon from '/src/assets/sports/table-tennis.svg'

const DownArrow = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="#7d7d7d"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		style={{ marginLeft: 'auto' }}
	>
		<polyline points="6 9 12 15 18 9" />
	</svg>
)

type SportOption = {
	label: string
	value: string
	icon: JSX.Element
}

const sports: SportOption[] = [
	{ label: 'Select a sport', value: '', icon: <></> },
	{ label: 'Football', value: 'football', icon: <img src={footballIcon} alt="football" /> },
	{
		label: 'Basketball',
		value: 'basketball',
		icon: <img src={basketballIcon} alt="basketball" />,
	},
	{
		label: 'Volleyball',
		value: 'volleyball',
		icon: <img src={volleyballIcon} alt="volleyball" />,
	},
	{ label: 'Tennis', value: 'tennis', icon: <img src={tennisIcon} alt="tennis" /> },
	{
		label: 'Table Tennis',
		value: 'table-tennis',
		icon: <img src={tableTennisIcon} alt="table tennis" />,
	},
]

interface SportSelectProps {
	value: string
	onChange: (value: string) => void
	className?: string
}

const SportSelect: React.FC<SportSelectProps> = ({ value, onChange, className }) => {
	const selected = sports.find(s => s.value === value) || sports[0]

	return (
		<div className={`sport-select ${className || ''}`}>
			<Listbox value={value} onChange={onChange}>
				<Listbox.Button className="select-button">
					<div className="select-button-content">
						{selected.icon}
						<span>{selected.label}</span>
						<DownArrow />
					</div>
				</Listbox.Button>

				<Listbox.Options className="options">
					{sports.map(sport => (
						<Listbox.Option key={sport.value} value={sport.value} className="option">
							<div className="option-content">
								{sport.icon}
								<span>{sport.label}</span>
							</div>
						</Listbox.Option>
					))}
				</Listbox.Options>
			</Listbox>
		</div>
	)
}

export default SportSelect
