import React, { useState, useEffect } from 'react';
import './ActivityFeed.scss';
import ActivityFeed from './ActivityFeed';

const ActivityFeedWrapper: React.FC = () => {
  const [showFeed, setShowFeed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) setShowFeed(true); // Asigură afișarea pe desktop
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFeed = () => setShowFeed(prev => !prev);

  return (
    <div className="activity-feed-wrapper">
      {isMobile && (
        <button className="toggle-button" onClick={toggleFeed}>
          {showFeed ? 'Hide recent activity' : 'View recent activity'}
        </button>
      )}
      {(!isMobile || showFeed) && <ActivityFeed />}
    </div>
  );
};

export default ActivityFeedWrapper;
