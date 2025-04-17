import React from 'react';
import './StatCards.scss';
interface StatCardProps {
  title: string;
  subtitle: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, subtitle, value }) => (
  <div className="stat-card">
    <div className="stat-header">
      <small>{title}</small>
      <h3>{subtitle}</h3>
    </div>
    <div className="stat-value">{value}</div>
  </div>
);

const StatsCards: React.FC = () => {
  const cards = [
    { id: 'bookings', title: 'Total', subtitle: 'Bookings', value: '367' },
    { id: 'venues', title: 'Active', subtitle: 'Venues', value: '10' },
    { id: 'new-users', title: 'New', subtitle: 'Users', value: '14' },
    { id: 'total-users', title: 'Total', subtitle: 'Users', value: '1.340' },
    { id: 'revenue', title: 'Revenue', subtitle: 'This Month', value: '$2.786' }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <StatCard
          key={card.id}
          title={card.title}
          subtitle={card.subtitle}
          value={card.value}
        />
      ))}
    </div>
  );
};

export default StatsCards;
