import Layout from '../../components/Layout/Layout'
import UserCard from '../../components/UserCard/UserCard'

import './Profile.scss'

const Profile = () => {
  return (
    <Layout>
      <div className="profile-page">
        <UserCard />
        {/* Aici vor veni ActivityFeed și ReviewList */}
      </div>
    </Layout>
  )
}

export default Profile
