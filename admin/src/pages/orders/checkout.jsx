import React, { useEffect, useState } from "react";
import {
    PaymentElement,
    LinkAuthenticationElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import './index.css'
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: window.innerWidth < 500 ? window.innerWidth - 20 : 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export default function CheckoutForm({ clientSecret, data, pay, handleClose, setLoading }) {

    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState(data?.email);
    const [message, setMessage] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage({ success: "Payment succeeded!" });
                    break;
                case "processing":
                    setMessage({ process: "Your payment is processing." });
                    break;
                case "requires_payment_method":
                    setMessage({ error: "Your payment was not successful, please try again." });
                    break;
                default:
                    setMessage({ error: "Something went wrong." });
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);
        setLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: import.meta.env.VITE_APP_URL + "confirm-order",
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
        setLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs"
    }

    return (
        <Modal
            open={pay}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <form id="payment-form" onSubmit={handleSubmit}>
                    <LinkAuthenticationElement
                        id="link-authentication-element"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <PaymentElement id="payment-element" options={paymentElementOptions} />
                    <button disabled={isLoading || !stripe || !elements} id="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white self-center py-2 px-4 rounded my-5"
                    >
                        <span id="button-text">
                            {"Pay now"}
                        </span>
                    </button>
                    {/* Show any error or success messages */}
                    {message.error && (
                        <div className="card-error" role="alert">
                            {message.error}
                        </div>
                    )}
                    {message.success && (
                        <div className="card-success" role="alert">
                            {message.success}
                        </div>
                    )}
                    {message.process && (
                        <div className="card-process" role="alert">
                            {message.process}
                        </div>
                    )}
                </form>
            </Box>
        </Modal>
    );
}