<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Content-Type: application/json');

// Test response
echo json_encode([
    'status' => 'success',
    'message' => 'PHP is working',
    'php_version' => PHP_VERSION,
    'server' => $_SERVER['SERVER_SOFTWARE']
]); 