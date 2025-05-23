import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import LocationComponent from '../../components/LocationComponent/LocationComponent';
import FilterBar from '../../components/FilterBar/FilterBar';
import './Locations.scss';
import axios from 'axios';

interface Location {
  id: number;
  title: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  stars: number;
  pricePerHour: string;
  image: string;
  sport: string;
  hourlyRate: number;
  openingTime: string;
  closingTime: string;
}

interface Filters {
  sport: string;
  price: '' | 'ascending' | 'descending';
  startTime: string;
  endTime: string;
}

const Locations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [filters, setFilters] = useState<Filters>({
    sport: '',
    price: '',
    startTime: '',
    endTime: '',
  });

  // Fetch locations from the backend API
  useEffect(() => {
    axios.get('http://localhost:8081/locations')
      .then(response => {
        setLocations(response.data);
        setFilteredLocations(response.data);
      })
      .catch(error => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);

    // Build the URL for the GET request with filters
    const params: any = {};
    if (newFilters.sport) params.sport = newFilters.sport;
    if (newFilters.price) params.price = newFilters.price;
    if (newFilters.startTime) params.start = newFilters.startTime;
    if (newFilters.endTime) params.end = newFilters.endTime;

    // Fetch filtered locations
    axios.get('http://localhost:8081/locations/filter', { params })
      .then(response => {
        setFilteredLocations(response.data);
      })
      .catch(error => {
        console.error("Error fetching filtered locations:", error);
      });
  };


  return (
    <Layout>
      <div className="locations-page">
        {/* Include FilterBar */}
        <FilterBar onFilterChange={handleFilterChange} />

        <div className="locations-grid">
          {filteredLocations.map((location) => (
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
