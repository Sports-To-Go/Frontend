import React from 'react';
import './LocationReservationModal.scss';

type Props = {
  location: {
    id: number;
    title: string;
    description: string;
    stars: number;
    image: string;
    pricePerHour: string;
  };
  onClose: () => void;
};

const LocationReservationModal: React.FC<Props> = ({ location, onClose }) => {
  return (
    <div className="reservation-overlay" onClick={onClose}>
      <div className="reservation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reservation-image-container">
          <img src={location.image} alt={location.title} className="reservation-image" />
        </div>

        <div className="reservation-content">
          <h2 className="reservation-title">{location.title}</h2>
          <p className="reservation-description">{location.description}</p>
          <p className="reservation-stars">{'⭐'.repeat(location.stars)}</p>
          <p className="price">{location.pricePerHour} / hour</p>
          
          <div className="reservation-buttons">
            <button className="reserve-button" onClick={() => alert('Rezervare inițiată!')}>
              Rezervă acum
            </button>
            <button className="close-button" onClick={onClose}>
              Închide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationReservationModal;
