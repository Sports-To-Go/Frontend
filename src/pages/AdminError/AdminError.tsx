import React from 'react';
import './AdminError.scss';

const AdminError: React.FC = () => {
  return (
    <div className="admin-error">
      <h1>Admin Access Restricted</h1>
      <p>Mobile access to admin panel is not allowed.</p>
      
      <div className="reasons">
        <h2>Reasons:</h2>
        <ul>
          <li>Enhanced security requirements</li>
          <li>Complex interface needs desktop screen</li>
          <li>Critical actions need precise input</li>
        </ul>
      </div>

      <p>Please use a computer to continue.</p>
    </div>
  );
};

export default AdminError;