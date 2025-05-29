import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Reservation.scss';

const Reservation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Simulăm extragerea unei locații pe baza ID-ului (ar trebui înlocuit cu date reale din API/context)
  const location = {
    id,
    title: `Location ${id}`,
    description: `This is a detailed description of location ${id}.`,
    stars: 4,
    image: 'https://www.indfloor.ro/wp-content/uploads/2021/07/DJI_0467.jpg',
    pricePerHour: '$29.99',
  };

  const handleReservation = () => {
    alert(`Rezervare făcută pentru ${location.title}!`);
    navigate('/locations');
  };

  return (
    <div className="reservation-page">
      <div className="reservation-card">
        <img src={location.image} alt={location.title} className="reservation-image" />
        <div className="reservation-details">
          <h2>{location.title}</h2>
          <div className="reservation-stars">{'⭐'.repeat(location.stars)}</div>
          <p>{location.description}</p>
          <p className="reservation-price">{location.pricePerHour} / hour</p>
          <button className="reservation-button" onClick={handleReservation}>
            Rezervă
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
