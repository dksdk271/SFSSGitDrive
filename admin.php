<?php
// admin.php - simple server-side admin to manage tracking (optional use)
// Note: This is a minimal example. For production use secure authentication.
require 'config.php';
session_start();

if(isset($_POST['login'])){
    $p = $_POST['password'] ?? '';
    if($p === 'sfssadmin'){ $_SESSION['admin']=1; }
}

if(isset($_POST['add']) && $_SESSION['admin']){
    $awb = $_POST['awb'] ?? '';
    $status = $_POST['status'] ?? '';
    $note = $_POST['note'] ?? '';
    if($awb){
        try {
            $pdo = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
            $stmt = $pdo->prepare('INSERT INTO tracking (awb, status, note, updated_at) VALUES (?,?,?,NOW())');
            $stmt->execute([$awb, $status, $note]);
            $msg = 'Saved';
        } catch(Exception $e){
            $err = $e->getMessage();
        }
    }
}
?>
<!doctype html>
<html><head><meta charset="utf-8"><title>Admin - SFSS</title></head><body>
<?php if(!isset($_SESSION['admin'])): ?>
  <h2>Login</h2>
  <form method="post"><input type="password" name="password"><button name="login">Login</button></form>
<?php else: ?>
  <h2>Admin - add tracking</h2>
  <?php if(isset($msg)) echo "<div style='color:green;'>$msg</div>"; ?>
  <?php if(isset($err)) echo "<div style='color:red;'>$err</div>"; ?>
  <form method="post">
    <input name="awb" placeholder="AWB"><br>
    <input name="status" placeholder="Status"><br>
    <input name="note" placeholder="Note"><br>
    <button name="add">Add</button>
  </form>
  <p><a href="index.html">Back to site</a></p>
<?php endif; ?>
</body></html>
