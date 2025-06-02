import React, { useEffect, useState } from 'react';
import './UserReviews.scss';
import UserReviewItem from '../UserReviewsItem/UserReviewsItem';
import { useAuth } from '../../context/UserContext';
import axios from 'axios';
import { BACKEND_URL } from '../../../integration-config';
import { auth } from '../../firebase/firebase';

interface Report {
    id: string;
    createdAt: string;
    reason: string;
    severity?: number;
    reportedBy?: {
        displayName?: string;
        photoURL?: string;
    };
}

const UserReviews: React.FC = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            if (!user?.uid) return;
            
            try {
                const token = await auth.currentUser?.getIdToken();
                const response = await axios.get<Report[]>(
                    `${BACKEND_URL}/reports`,
                    {
                        params: {
                            targetId: user.uid,
                            targetType: 'USER'
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const formattedReviews = response.data.map((report, index) => ({
                    date: new Date(report.createdAt).toLocaleDateString(),
                    text: report.reason,
                    rating: report.severity ? Math.min(Math.max(report.severity, 1), 5) : 1,
                    reportedById: report.id,
                    reporterIndex: index
                }));

                setReviews(formattedReviews);
            } catch (err) {
                setError('Failed to load reports');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [user?.uid]);

    return (
        <div className="user-reviews">
            <h2 className="user-reviews__title">User Reports</h2>
            <div className="user-reviews__card">
                <p className="user-reviews__count">{reviews.length} {reviews.length === 1 ? 'Report' : 'Reports'}</p>
                <div className="user-reviews__scroll-container">
                    {loading ? (
                        <p>Loading reports...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <UserReviewItem
                                key={review.reportedById || index}
                                review={review}
                                index={review.reporterIndex || index}
                            />
                        ))
                    ) : (
                        <p>No reports found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserReviews;