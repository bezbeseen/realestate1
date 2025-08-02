<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataDir = '../data/';
$commentsFile = $dataDir . 'image-comments.json';
$statusFile = $dataDir . 'image-status.json';

// Create data directory if it doesn't exist
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
    
    if ($action === 'save_comment') {
        // Load existing comments
        $comments = [];
        if (file_exists($commentsFile)) {
            $comments = json_decode(file_get_contents($commentsFile), true) ?? [];
        }
        
        // Add new comment
        $newComment = [
            'id' => uniqid(),
            'name' => $input['name'],
            'image' => $input['image'],
            'comment' => $input['comment'],
            'rating' => (int)$input['rating'],
            'date' => date('Y-m-d H:i:s')
        ];
        
        $comments[] = $newComment;
        
        // Save to file
        if (file_put_contents($commentsFile, json_encode($comments, JSON_PRETTY_PRINT))) {
            echo json_encode(['success' => true, 'message' => 'Comment saved successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to save comment']);
        }
    }
    
    elseif ($action === 'save_status') {
        // Load existing statuses
        $statuses = [];
        if (file_exists($statusFile)) {
            $statuses = json_decode(file_get_contents($statusFile), true) ?? [];
        }
        
        // Update status
        $statuses[$input['image']] = $input['status'];
        
        // Save to file
        if (file_put_contents($statusFile, json_encode($statuses, JSON_PRETTY_PRINT))) {
            echo json_encode(['success' => true, 'message' => 'Status saved successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to save status']);
        }
    }
    
    elseif ($action === 'get_data') {
        // Load comments
        $comments = [];
        if (file_exists($commentsFile)) {
            $comments = json_decode(file_get_contents($commentsFile), true) ?? [];
        }
        
        // Load statuses
        $statuses = [];
        if (file_exists($statusFile)) {
            $statuses = json_decode(file_get_contents($statusFile), true) ?? [];
        }
        
        echo json_encode([
            'success' => true,
            'comments' => $comments,
            'statuses' => $statuses
        ]);
    }
    
    else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
}

elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Load comments
    $comments = [];
    if (file_exists($commentsFile)) {
        $comments = json_decode(file_get_contents($commentsFile), true) ?? [];
    }
    
    // Load statuses
    $statuses = [];
    if (file_exists($statusFile)) {
        $statuses = json_decode(file_get_contents($statusFile), true) ?? [];
    }
    
    echo json_encode([
        'success' => true,
        'comments' => $comments,
        'statuses' => $statuses
    ]);
}
?> 