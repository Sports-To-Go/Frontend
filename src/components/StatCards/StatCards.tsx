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

export default StatCard;