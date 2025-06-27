<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log errors to a file
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/stripe-errors.log');

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Set content type
header('Content-Type: application/json');

try {
    // Check if vendor/autoload.php exists
    if (!file_exists(__DIR__ . '/../vendor/autoload.php')) {
        throw new Exception('Stripe PHP library not installed. Please run: composer require stripe/stripe-php');
    }

    require __DIR__ . '/../vendor/autoload.php';

    // Set your secret key: remember to change this to your live secret key in production
    \Stripe\Stripe::setApiKey('sk_test_51RYGJPQ67OoMep3yKwHEZgm4ryGehWXH2MzkE2GeSg0otn9O8jxDfcpUHMfKTlmjQpYBveOZ5NPl1NOVUqfIQPem00DPrC8jrN');

    // Get the POST data
    $jsonStr = file_get_contents('php://input');
    
    // Log the received data
    error_log('Received data: ' . $jsonStr);
    
    $jsonObj = json_decode($jsonStr);

    if (!$jsonObj) {
        throw new Exception('Invalid JSON data: ' . json_last_error_msg());
    }

    // Handle both single product and cart checkout
    $lineItems = [];
    
    if (isset($jsonObj->line_items)) {
        // Cart checkout with multiple items
        $lineItems = $jsonObj->line_items;
    } else {
        // Single product checkout (backward compatibility)
        if (!isset($jsonObj->variant) || !isset($jsonObj->quantity) || !isset($jsonObj->price)) {
            throw new Exception('Missing required fields for single product checkout');
        }
        
        $lineItems = [[
            'price_data' => [
                'currency' => 'usd',
                'product_data' => [
                    'name' => 'Business Cards - ' . $jsonObj->variant,
                    'description' => 'Quantity: ' . $jsonObj->quantity,
                ],
                'unit_amount' => $jsonObj->price * 100,
            ],
            'quantity' => 1,
        ]];
    }

    // Get success and cancel URLs
    $successUrl = isset($jsonObj->success_url) ? $jsonObj->success_url : 'https://' . $_SERVER['HTTP_HOST'] . '/success.html';
    $cancelUrl = isset($jsonObj->cancel_url) ? $jsonObj->cancel_url : 'https://' . $_SERVER['HTTP_HOST'] . '/cart.html';

    // Create a checkout session
    $checkout_session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => $lineItems,
        'mode' => 'payment',
        'success_url' => $successUrl,
        'cancel_url' => $cancelUrl,
        'shipping_address_collection' => [
            'allowed_countries' => ['US', 'CA'],
        ],
        'billing_address_collection' => 'required',
        'customer_creation' => 'always',
    ]);

    echo json_encode(['id' => $checkout_session->id]);
} catch (Exception $e) {
    error_log('Error in create-checkout-session.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
} 