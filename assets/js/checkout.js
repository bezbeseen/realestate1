// This is your test publishable API key.
const stripe = Stripe(process.env.STRIPE_PUBLISHABLE_KEY);

initialize();

async function initialize() {
    const checkoutDiv = document.getElementById('checkout');
    const items = JSON.parse(localStorage.getItem('shoppingCart') || '[]');

    if (items.length === 0) {
        checkoutDiv.innerHTML = `
            <div class="text-center">
                <h2>Your cart is empty.</h2>
                <p class="lead">Add some products to your cart before checking out.</p>
                <a href="/products.html" class="btn btn-primary mt-3">Browse Products</a>
            </div>
        `;
        return;
    }

    const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
    });

    const { clientSecret } = await response.json();

    const checkout = await stripe.initEmbeddedCheckout({
        clientSecret,
    });

    // Mount Checkout
    checkout.mount('#checkout');
}