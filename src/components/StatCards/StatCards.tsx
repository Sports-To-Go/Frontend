import React, { useEffect, useState } from 'react';
import './StatCards.scss';
import axios from 'axios';
import { BACKEND_URL } from '../../../integration-config';

interface StatCardProps {
  title: string;
  subtitle: string;
  value: string;
}

const StatCardComponent: React.FC<StatCardProps> = ({ title, subtitle, value }) => (
  <div className="stat-card">
    <div className="stat-header">
      <small>{title}</small>
      <h3>{subtitle}</h3>
    </div>
    <div className="stat-value">{value}</div>
  </div>
);

export const StatCardsContainer: React.FC = () => {
  const [stats, setStats] = useState<StatCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all statistics in parallel
        const [locationsCountRes, reservationsCountRes, recentUsersCountRes] = await Promise.all([
          axios.get<number>(`http://${BACKEND_URL}/admin/locations/count`),
          axios.get<number>(`http://${BACKEND_URL}/admin/reservations/count`),
          axios.get<number>(`http://${BACKEND_URL}/admin/recent-users/count`)
        ]);

        // Transform the responses into StatCardProps format
        const statsData: StatCardProps[] = [
          {
            title: 'Locations',
            subtitle: 'Total Locations',
            value: locationsCountRes.data.toString()
          },
          {
            title: 'Reservations',
            subtitle: 'Total Reservations',
            value: reservationsCountRes.data.toString()
          },
          {
            title: 'New Users',
            subtitle: 'Registered Last Week',
            value: recentUsersCountRes.data.toString()
          }
        ];

        setStats(statsData);
      } catch (err) {
        setError('Failed to load statistics');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading-message">Loading statistics...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="stat-cards-container">
      {stats.map((stat, index) => (
        <StatCard 
          key={`stat-${index}`} 
          title={stat.title}
          subtitle={stat.subtitle}
          value={stat.value}
        />
      ))}
    </div>
  );
};

export const StatCard = StatCardComponent;
export default StatCardsContainer;