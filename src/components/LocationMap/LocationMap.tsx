import React, { useState } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import "./LocationMap.scss";

interface LocationMapProps {
  address: string;
  onAddressChange: (value: string) => void;
  onAddressBlur: () => void;
  coordinates: {
    lat: number;
    lng: number;
  };
  onCoordinatesChange: (coords: { lat: number; lng: number }) => void;
}

const containerStyle = {
  width: "100%",
  height: "300px",
};

const LocationMap: React.FC<LocationMapProps> = ({
  address,
  onAddressChange,
  onAddressBlur,
  coordinates,
  onCoordinatesChange,
}) => {
  // Store a reference to the map instance once it has loaded.
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  return (
    <LoadScript googleMapsApiKey="AIzaSyCJaVZNeUe4fj0vYW0am3dN1AzauG6PBp8">
      <div className="map-wrapper">
        {/* Input positioned over the map */}
        <input
          type="text"
          className="map-input"
          placeholder="Enter your court's address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          onBlur={onAddressBlur}
        />
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={coordinates}
          zoom={15}
          options={{ disableDefaultUI: true }}
          onLoad={(map) => {
            setMapInstance(map);
          }}
          onIdle={() => {
            // When map becomes idle, get the center and update parent's state.
            if (mapInstance) {
              const center = mapInstance.getCenter();
              if (center) {
                onCoordinatesChange({
                  lat: center.lat(),
                  lng: center.lng(),
                });
              }
            }
          }}
        >
          {/* Marker is placed at the provided coordinates */}
          <Marker position={coordinates} />
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default LocationMap;