import React, { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from '../../components/CheckoutForm/CheckoutForm'
import './PaymentModal.scss'
import { BACKEND_URL } from '../../../integration-config'

const pk = import.meta.env.VITE_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(pk)

type paymentModalProps = {
	onClose: () => void
	onSuccess: () => void
	amount: number
}

const PaymentModal: React.FC<paymentModalProps> = ({ onClose, onSuccess, amount }) => {
	const [clientSecret, setClientSecret] = useState<string | null>(null)

	useEffect(() => {
		fetch(`http://${BACKEND_URL}/api/payments/create-payment-intent`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				amount: amount,
				currency: 'ron',
				rentalId: 'loc123',
			}),
		})
			.then(r => {
				if (!r.ok) throw new Error(r.statusText)
				return r.json()
			})
			.then(data => setClientSecret(data.clientSecret))
			.catch(err => console.error('Error creating payment intent:', err))
	}, [])

	if (!clientSecret) {
		return null // or a spinner
	}

	return (
		<div className="payment-overlay" onClick={onClose}>
			<div className="payment-page" onClick={e => e.stopPropagation()}>
				<button className="payment-close" onClick={onClose}>
					×
				</button>
				<Elements stripe={stripePromise} options={{ clientSecret }}>
					<CheckoutForm onSuccess={onSuccess} />
				</Elements>
			</div>
		</div>
	)
}

export default PaymentModal
