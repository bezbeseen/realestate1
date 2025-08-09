<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Store API key securely
define('FREEPIK_API_KEY', 'FPSXa4f54291a1c68d77624fc2bedb15d2ef');

// Get the requested action
$action = isset($_GET['action']) ? $_GET['action'] : '';

function makeFreepikRequest($endpoint, $params = []) {     
    $url = 'https://api.freepik.com/v1/' . $endpoint;  
    
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'x-freepik-api-key: ' . FREEPIK_API_KEY,
        'Accept: application/json',
        'Content-Type: application/json' 
    ]);
    
    if (!empty($params)) {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch)) {
        $error = curl_error($ch);
        curl_close($ch);
        return json_encode([
            'success' => false,
            'error' => 'cURL Error: ' . $error
        ]);
    }
    
    curl_close($ch);
    
    if ($httpCode !== 200) {
        return json_encode([
            'success' => false,
            'error' => 'Freepik API Error',
            'code' => $httpCode,
            'response' => json_decode($response, true)
        ]);
    }
    
    $data = json_decode($response, true);
    return json_encode([
        'success' => true,
        'data' => $data
    ]);
}

switch ($action) {
    case 'search':
        $query = isset($_GET['query']) ? $_GET['query'] : '';
        $response = makeFreepikRequest('resources', [
            'term' => $query,
            'filters' => [
                'content_type' => [
                    'vector' => 1
                ]
            ],
            'limit' => 10
        ]);
        echo $response;
        break;
        
    case 'get_image':
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        if (empty($id)) {
            echo json_encode(['success' => false, 'error' => 'Image ID is required']);
            break;
        }
        $response = makeFreepikRequest('resources/' . $id . '/download');
        echo $response;
        break;
        
    default:
        echo json_encode([
            'success' => false,
            'error' => 'Invalid action specified'
        ]);
}
?> 