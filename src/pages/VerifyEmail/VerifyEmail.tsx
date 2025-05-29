import './VerifyEmail.scss';
import { useNavigate } from 'react-router-dom';
import { useEmailVerification } from '../../context/EmailVerificationContext';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { setShowVerifyPage } = useEmailVerification();

  const handleGoToLogin = () => {
    setShowVerifyPage(false);
    navigate('/login');
  };

  return (
    <div className="verify-email-page">
      <form className="verify-email-form">
        <h2>Verifică-ți adresa de email</h2>
        <p>
          Ți-am trimis un email de confirmare. Te rugăm să-l accesezi pentru a-ți activa contul.
        </p>
        <button type="button" onClick={handleGoToLogin} className="go-to-login-btn">
          Ai verificat email-ul? <br /> Întoarce-te la login
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
