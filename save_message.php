<?php
// Set content type to JSON
header('Content-Type: application/json');

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get and validate input
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING) ?? '';
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING) ?? '';

// Validate input
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Bitte fülle alle Felder aus.']);
    exit;
}

// Sanitize email for filename
$safeEmail = preg_replace('/[^a-zA-Z0-9@._-]/', '_', $email);
$date = date('Y-m-d');
$timestamp = date('Y-m-d_His');
$filename = "{$safeEmail}_{$timestamp}.txt";
$directory = __DIR__ . '/messages';
$filepath = $directory . '/' . $filename;

// Create messages directory if it doesn't exist
if (!file_exists($directory)) {
    if (!mkdir($directory, 0755, true) && !is_dir($directory)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Konnte das Verzeichnis für Nachrichten nicht erstellen.']);
        exit;
    }
}

// Format the message content
$content = "Kontaktanfrage\n";
$content .= str_repeat("-", 16) . "\n";
$content .= "Datum: " . date('d.m.Y H:i:s') . "\n";
$content .= "Name: {$name}\n";
$content .= "E-Mail: {$email}\n\n";
$content .= "Nachricht:\n{$message}";

// Save to file
$result = file_put_contents($filepath, $content);

if ($result !== false) {
    // Set proper permissions
    chmod($filepath, 0644);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Nachricht erfolgreich gespeichert.',
        'filename' => $filename
    ]);
} else {
    $error = error_get_last();
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Fehler beim Speichern der Nachricht: ' . ($error['message'] ?? 'Unbekannter Fehler')
    ]);
}
