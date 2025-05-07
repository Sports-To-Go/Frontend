import Layout from '../../components/Layout/Layout';
import LocationComponent from '../../components/LocationComponent/LocationComponent';
import './Locations.scss';

// Replace the image array with the provided image for all locations
const locations = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  title: `Location ${index + 1}`,
  description: `Description for location ${index + 1}`,
  stars: Math.floor(Math.random() * 5) + 1,
  image: "https://www.indfloor.ro/wp-content/uploads/2021/07/DJI_0467.jpg", // Fixed image for all locations
  pricePerHour: `$${(Math.random() * 50 + 10).toFixed(2)}`, // Random price between $10 and $60
}));

const Locations = () => {
  return (
    <Layout>
      <div className="locations-page">
        <div className="locations-grid">
          {locations.map((location) => (
            <LocationComponent
              key={location.id}
              location={location}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Locations;