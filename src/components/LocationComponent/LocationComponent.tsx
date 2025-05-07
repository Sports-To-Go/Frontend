import React, { useState } from 'react';
import LocationReservationModal from '../LocationComponent/LocationReservationModal';
import './LocationComponent.scss';

type LocationProps = {
  location: {
    id: number;
    title: string;
    description: string;
    stars: number;
    image: string;
    pricePerHour: string;
  };
};

const LocationComponent: React.FC<LocationProps> = ({ location }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="location-box" onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
        <div className="location-image-container">
          <img src={location.image} alt={`${location.title} Header`} className="location-header-image" />
        </div>
        <div className="location-content">
          <div className="location-header">
            <h3 className="location-title">{location.title}</h3>
            <div className="location-stars">{'⭐'.repeat(location.stars)}</div>
          </div>
          <p className="location-description">{location.description}</p>
          <div className="location-price">{location.pricePerHour} / hour</div>
        </div>
      </div>

      {isModalOpen && (
        <LocationReservationModal
          location={location}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default LocationComponent;
