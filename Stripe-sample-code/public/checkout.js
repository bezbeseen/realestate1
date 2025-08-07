// This is your test secret API key.
const stripe = Stripe("pk_test_51RYGJFLueRJGe2lx8qTxviTXVRRtvuaQgRIT8K5TelSB4dEscu8Q3N2USXAKXvH5yM0tJDOWYYVYYfCkataqzw0q00kXXVVbQf");

initialize();

// Create a Checkout Session
async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}