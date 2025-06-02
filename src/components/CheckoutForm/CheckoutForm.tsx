import React, { FormEvent, useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import './CheckoutForm.scss'

interface checkoutProps {
	onSuccess: () => void
}

const CheckoutForm: React.FC<checkoutProps> = ({ onSuccess }) => {
	const stripe = useStripe()
	const elements = useElements()
	const [isLoading, setIsLoading] = useState(false)
	const [message, setMessage] = useState<string | null>(null)

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		if (!stripe || !elements) return

		setIsLoading(true)
		setMessage(null)

		const { error, paymentIntent } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: window.location.href,
			},
			redirect: 'if_required',
		})

		if (error) {
			setMessage(error.message || 'Payment failed.')
		} else if (paymentIntent?.status === 'succeeded') {
			setMessage('🎉 Payment successful!')
			onSuccess()
		} else {
			setMessage(`Payment status: ${paymentIntent?.status}`)
		}

		setIsLoading(false)
	}

	return (
		<form onSubmit={handleSubmit} className="card-form">
			<PaymentElement />
			<button type="submit" disabled={!stripe || isLoading}>
				{isLoading ? 'Processing…' : 'Submit'}
			</button>
			{message && <div className="message">{message}</div>}
		</form>
	)
}

export default CheckoutForm
