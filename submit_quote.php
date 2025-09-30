<?php
// submit_quote.php
require 'config.php';

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$origin = $_POST['origin'] ?? '';
$destination = $_POST['destination'] ?? '';
$details = $_POST['details'] ?? '';

if(!$name || !$email){
    header('Location: index.html?error=1');
    exit;
}

try {
    $pdo = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    $stmt = $pdo->prepare('INSERT INTO quotes (name, email, origin, destination, details, created_at) VALUES (?,?,?,?,?,NOW())');
    $stmt->execute([$name, $email, $origin, $destination, $details]);
} catch(Exception $e){
    // ignore DB errors
}

$to = ADMIN_EMAIL;
$subject = 'New Quote Request from ' . $name;
$message = "You have a new quote request:\n\nName: $name\nEmail: $email\nOrigin: $origin\nDestination: $destination\nDetails: $details\n";
$headers = 'From: ' . $email . "\r\n" . 'Reply-To: ' . $email . "\r\n";

@mail($to, $subject, $message, $headers);

header('Location: index.html?sent=1');
exit;
?>