import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/UserContext'
import { useEmailVerification } from '../../context/EmailVerificationContext';

import Administration from '../../pages/Administration/Administration'
import AddLocationPage from '../../pages/AddLocation/AddLocationPage'
import Locations from '../../pages/Locations/Locations'
import Profile from '../../pages/Profile/Profile'
import Social from '../../pages/Social/Social'
import Login from '../../pages/Login/Login'
import ForgotPass from '../../pages/ForgotPass/ForgotPass';
import VerifyEmail from '../../pages/VerifyEmail/VerifyEmail';


const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  const { showVerifyPage } = useEmailVerification();

  const isAdmin = false;
 const isLogged = !!user && (
  user.emailVerified || 
  (user.providerData && user.providerData.some(
    (p: { providerId: string }) => 
      ['facebook.com', 'github.com'].includes(p.providerId)
  ))
);

  const routes = isAdmin ? (
    <>
      <Route path="/administration" element={<Administration />} />
      <Route path="*" element={<Navigate to="/administration" replace />} />
    </>
  ) : showVerifyPage ? (
    <>
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="*" element={<Navigate to="/verify-email" replace />} />
    </>
  ) : (
    <>
      <Route path="/social" element={isLogged ? <Social /> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={isLogged ? <Profile /> : <Navigate to="/login" replace />} />
      <Route path="/add-location" element={isLogged ? <AddLocationPage /> : <Navigate to="/login" replace />} />

      {!isLogged && <Route path="/login" element={<Login />} />}
      {!isLogged && <Route path="/forgot-password" element={<ForgotPass />} />}
      
      <Route path="/locations" element={<Locations />} />
      <Route path="*" element={<Navigate to="/locations" replace />} />
    </>
  );

  return <Routes>{routes}</Routes>;
};

export default AppRoutes
