import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './ForgotPass.scss';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useResetPassword } from '../../context/ResetPasswordContext';	
import { auth } from '../../firebase/firebase';

const ForgotPass: React.FC = () => {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const { canAccessReset } = useResetPassword();
	const navigate = useNavigate();

	if (!canAccessReset) {
		return <Navigate to="/login" replace />;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage('');
		setError('');

		if (!email.includes('@')) {
			setError('Te rugăm să introduci o adresă de email validă.');
			return;
		}

		try {
			await sendPasswordResetEmail(auth, email);
			setMessage('Dacă adresa există în sistem, vei primi un email de resetare.');
			setError('');
			setTimeout(() => {
				navigate('/login');
			}, 1500);
		} catch (err) {
			console.error(err);
			setError('A apărut o eroare la trimiterea emailului. Verifică adresa introdusă.');
		}
	};

	return (
		<div className="login-page">
			<div className="login-container">
				<h2 className="form-title">Recuperare parolă</h2>
				<p className="form-title">
					Introdu adresa ta de email și îți vom trimite un link pentru resetare.
				</p>
				<form onSubmit={handleSubmit} className="form">
					<input
						type="email"
						placeholder="Adresa de email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>

					<button type="submit" className="btn-primary">Trimite emailul</button>

					{error && <div className="error-message">{error}</div>}
					{message && <div className="success-message">{message}</div>}
				</form>

				<div className="signup">
					Ți-ai amintit parola? <a href="/login">Înapoi la autentificare</a>
				</div>
			</div>
		</div>
	);
};

export default ForgotPass;
