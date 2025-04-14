import Layout from '../../components/Layout/Layout';
import UserCard from '../../components/UserCard/UserCard';
import { useLocation, useNavigate } from 'react-router-dom';
import AddLocationForm from '../../components/AddLocationForm/AddLocationForm';

import './Profile.scss';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const param = new URLSearchParams(location.search);
  const showAddLocationForm = param.get('add') === 'location';

  return (
    <Layout>
      <div className="profile-page">
        <UserCard />

        {showAddLocationForm && (
          <AddLocationForm onCancel={() => navigate('/profile')} />
        )}

        {/* Aici vor veni ActivityFeed și ReviewList */}
      </div>
    </Layout>
  );
};

export default Profile;
