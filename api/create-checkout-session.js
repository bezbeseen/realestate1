const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const router = express.Router();

router.use(cors());
router.use(express.json());

router.post('/create-checkout-session', async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).send({ error: 'No items in cart' });
        }

        // A helper function to check if an image URL is local
        const isLocalUrl = (url) => {
            return url.startsWith('/') || url.startsWith('http://localhost');
        };

        // Convert our cart items into the format Stripe expects
        const line_items = items.map(item => {
            const imageUrl = item.image && !isLocalUrl(item.image) 
                ? [item.image] 
                : ['https://placehold.co/100x100/F4F4F4/333333?text=Be+Seen']; // Fallback image

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        images: imageUrl,
                    },
                    unit_amount: Math.round(item.price * 100), // Price in cents
                },
                quantity: item.quantity,
            }
        });

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: line_items,
            mode: 'payment',
            return_url: `${req.protocol}://${req.get('host')}/return.html?session_id={CHECKOUT_SESSION_ID}`,
        });

        res.send({ clientSecret: session.client_secret });

    } catch (error) {
        console.error("Stripe API Error:", error);
        res.status(500).send({ error: error.message });
    }
});

router.get('/session-status', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        res.send({
            status: session.status,
            customer_email: session.customer_details.email
        });
    } catch (error) {
        console.error("Stripe API Error:", error);
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;