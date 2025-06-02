import React, { useEffect, useState } from 'react';
import './ActivityFeed.scss';
import ActivityItem from '../ActivityItem/ActivityItem';
import { useAuth } from '../../context/UserContext';
import axios from 'axios';
import { BACKEND_URL } from '../../../integration-config';
import { auth } from '../../firebase/firebase';

interface Reservation {
    id: number;
    locationId: number;
    userId: string;
    locationName?: string;  
    startTime: string;
    endTime: string;
    date: string;
    paymentStatus: string;
    totalCost: number;
    locationImage?: string;  
    userRating?: number; 
}

const ActivityFeed = () => {
    const { user } = useAuth();
    const [activities, setActivities] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            if (!user?.uid) return;
            
            try {
                const token = await auth.currentUser?.getIdToken();
                const response = await axios.get<Reservation[]>(
                    `http://${BACKEND_URL}/reservations`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                
                const userReservations = response.data.filter(r => r.userId === user.uid);
                setActivities(userReservations);
            } catch (err) {
                setError('Failed to load activities');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [user?.uid]);

    const formatTimeDisplay = (start: string, end: string) => {
        return `${start} - ${end}`;
    };

    const formatStatusDisplay = (status: string, cost: number) => {
        return `Status: ${status} | Total: ${cost} RON`;
    };

    return (
        <div className="activity-feed">
            <h2 className="activity-feed__title">Recent Activity</h2>
            <div className="activity-feed__card">
                <div className="activity-feed__header">
                    <p className="activity-feed__last-online">Your Reservations</p>
                </div>
                <div className="activity-feed__scroll-container">
                    {loading ? (
                        <p>Loading activities...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : activities.length > 0 ? (
                        activities.map(activity => (
                            <ActivityItem
                                key={activity.id}
                                image={activity.locationImage || ''} 
                                title={`Reservation at ${activity.locationName || `Location #${activity.locationId}`}`}
                                time={formatTimeDisplay(activity.startTime, activity.endTime)}
                                description={formatStatusDisplay(activity.paymentStatus, activity.totalCost)}
                                rating={activity.userRating} 
                            />
                        ))
                    ) : (
                        <p>No activities found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityFeed;