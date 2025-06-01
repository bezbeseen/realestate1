<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Store API key securely
define('FREEPIK_API_KEY', 'FPSXa4f54291a1c68d77624fc2bedb15d2ef');

// Get the requested action
$action = isset($_GET['action']) ? $_GET['action'] : '';

function makeFreepikRequest($endpoint, $params = []) {
    $params['apikey'] = FREEPIK_API_KEY;
    $url = 'https://api.freepik.com/v1/' . $endpoint . '?' . http_build_query($params);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        return json_encode([
            'success' => false,
            'error' => 'Failed to fetch from Freepik API', 
            'code' => $httpCode
        ]);
    }
    
    return $response;
}

switch ($action) {
    case 'search':
        $query = isset($_GET['query']) ? $_GET['query'] : '';
        $response = makeFreepikRequest('resources/search', [
            'q' => $query,
            'limit' => 10,
            'type' => 'vector'
        ]);
        echo $response;
        break;
        
    case 'get_image':
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        $response = makeFreepikRequest('resources/get/' . $id);
        echo $response;
        break;
        
    default:
        echo json_encode([
            'success' => false,
            'error' => 'Invalid action specified'
        ]);
}
?> 