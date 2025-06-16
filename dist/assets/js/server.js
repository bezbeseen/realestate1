// server.js
const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY');

app.use(express.static('public'));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price: req.body.priceId,
      quantity: 1
    }],
    success_url: 'success.html',
    cancel_url: 'cancel.html'
  });

  res.json({ id: session.id });
});

app.listen(4242, () => console.log('Running on http://localhost:8000'));
