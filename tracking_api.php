<?php
// tracking_api.php - simple API to lookup tracking in DB
require 'config.php';
header('Content-Type: application/json');

$awb = $_GET['awb'] ?? '';
if(!$awb){ echo json_encode(['ok'=>0,'error'=>'No AWB']); exit; }

try {
    $pdo = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    $stmt = $pdo->prepare('SELECT awb, status, note, updated_at FROM tracking WHERE awb = ? ORDER BY updated_at DESC LIMIT 1');
    $stmt->execute([$awb]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if($row){
        echo json_encode(['ok'=>1,'data'=>$row]);
    } else {
        echo json_encode(['ok'=>0,'error'=>'Not found']);
    }
} catch(Exception $e){
    echo json_encode(['ok'=>0,'error'=>'DB error']);
}
?>