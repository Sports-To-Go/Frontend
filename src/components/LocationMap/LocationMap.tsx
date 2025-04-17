import { GoogleMap, Autocomplete, useJsApiLoader } from '@react-google-maps/api'
import { useRef, useCallback } from 'react'
import { getDistanceInMeters } from '../../utils/geocode'
import pinIcon from '/src/assets/pin.svg'
import './LocationMap.scss'

interface Props {
	address: string
	onAddressChange: (newAddress: string) => void
	onAddressSelect: (coords: { lat: number; lng: number }) => void
	lat: number
	lng: number
	onPinMoved?: (coords: { lat: number; lng: number }) => void
}

const containerStyle = {
	width: '100%',
	height: '250px',
	borderRadius: '12px',
	overflow: 'hidden',
}

const libraries: 'places'[] = ['places']

const LocationMap = ({
	address,
	onAddressChange,
	onAddressSelect,
	lat,
	lng,
	onPinMoved,
}: Props) => {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: 'AIzaSyCJaVZNeUe4fj0vYW0am3dN1AzauG6PBp8',
		libraries,
	})

	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
	const mapRef = useRef<google.maps.Map | null>(null)
	const lastGeocodedPositionRef = useRef<{ lat: number; lng: number }>({ lat, lng })

	const handlePlaceChanged = () => {
		const place = autocompleteRef.current?.getPlace()
		if (place?.geometry?.location) {
			const newLat = place.geometry.location.lat()
			const newLng = place.geometry.location.lng()
			const formattedAddress = place.formatted_address || ''

			onAddressChange(formattedAddress)
			onAddressSelect({ lat: newLat, lng: newLng })

			lastGeocodedPositionRef.current = { lat: newLat, lng: newLng }
		}
	}

	const handleMapLoad = useCallback((map: google.maps.Map) => {
		mapRef.current = map
	}, [])

	const handleMapIdle = useCallback(() => {
		const map = mapRef.current
		if (!map) return

		const newCenter = map.getCenter()
		if (!newCenter) return

		const newLat = newCenter.lat()
		const newLng = newCenter.lng()
		const prev = lastGeocodedPositionRef.current

		const distance = getDistanceInMeters(prev, { lat: newLat, lng: newLng })

		if (distance > 50) {
			onAddressSelect({ lat: newLat, lng: newLng })
			if (onPinMoved) {
				onPinMoved({ lat: newLat, lng: newLng })
			}
			lastGeocodedPositionRef.current = { lat: newLat, lng: newLng }
		}
	}, [onAddressSelect, onPinMoved])

	if (!isLoaded) return <p>Loading map...</p>

	return (
		<div className="location-map-wrapper">
			<div className="map-controls">
				<div className="input-wrapper">
					<img src={pinIcon} alt="icon" className="input-icon" />
					<Autocomplete
						onLoad={ref => (autocompleteRef.current = ref)}
						onPlaceChanged={handlePlaceChanged}
					>
						<input
							type="text"
							className="address-input"
							placeholder="Enter your address"
							value={address}
							onChange={e => onAddressChange(e.target.value)}
						/>
					</Autocomplete>
				</div>
			</div>

			<GoogleMap
				mapContainerStyle={containerStyle}
				center={{ lat, lng }}
				zoom={18}
				onLoad={handleMapLoad}
				onIdle={handleMapIdle}
				options={{ disableDefaultUI: true }}
			/>

			<div className="map-pin-wrapper">
				<img src={pinIcon} className="map-pin" alt="Map Pin" />
			</div>
		</div>
	)
}

export default LocationMap
