import React, { useEffect, useState } from 'react';
import './UserReviews.scss';
import UserReviewItem from '../UserReviewsItem/UserReviewsItem';
import { useAuth } from '../../context/UserContext';
import axios from 'axios';
import { BACKEND_URL } from '../../../integration-config';
import { auth } from '../../firebase/firebase';
import NoData from '../NoData/NoData';

interface Report {
    id: number;
    createdAt: string;
    reason: string;
    reportedBy: string;
    targetId: string;
    targetType: string;
}

const UserReviews: React.FC = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            if (!user?.uid) {
                setLoading(false);
                return;
            }

            try {
                const token = await auth.currentUser?.getIdToken();
                const response = await axios.get<Report[]>(
                    `http://${BACKEND_URL}/admin/reports/targetUser/${user.uid}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const receivedReports = response.data || [];

                const formattedReviews = receivedReports.map((report, index) => ({
                    id: report.id,
                    date: new Date(report.createdAt).toLocaleDateString(),
                    text: report.reason,
                    rating: 1,
                    reportedBy: report.reportedBy,
                    targetId: report.targetId,
                    targetType: report.targetType,
                    reporterIndex: index
                }));

                setReviews(formattedReviews);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 403) {
                        setError('You are not authorized to view these reports.');
                    } else if (err.response?.status === 204) {
                        setReviews([]);
                    } else {
                        setError('Failed to load reports: ' + (err.response?.data || err.message));
                    }
                } else {
                    setError('An unexpected error occurred.');
                }
                console.error('Error fetching reports:', err);
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
                                key={review.id}
                                review={review}
                                index={index} 
                            />
                        ))
                    ) : (
                        <NoData>This user did not cause any issues</NoData>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserReviews;