SFSS Courier - Full Project (Static frontend + PHP backend)
-----------------------------------------------------------

Files:
- index.html        -> Frontend landing page and forms
- style.css         -> Styles
- script.js         -> Frontend JS (rate calc, captcha, local admin)
- submit_quote.php  -> PHP form handler (saves to DB and emails admin)
- tracking_api.php  -> Simple API to lookup tracking by AWB (returns JSON)
- admin.php         -> Minimal server-side admin to add tracking entries (optional)
- config.php        -> Configure DB creds, admin email, etc.
- database.sql      -> SQL to create DB and tables
- images/           -> put your logo as images/logo.png

Setup steps (quick):
1. Upload all files to a PHP-enabled web host (supports PHP 7+ and MySQL).
2. Edit config.php with your DB credentials and admin email.
3. Import database.sql into your MySQL server to create DB and tables.
4. Ensure PHP mail() works on host (or configure SMTP). If mail() doesn't work, integrate PHPMailer or transactional email API.
5. Open admin.php and login with password: sfssadmin (change in code for production).
6. For WhatsApp notifications we open wa.me from client-side; for automated WhatsApp server-side you need Twilio/Meta API.

Security notes:
- Admin.php is minimal and not production-secure. For production use proper authentication & HTTPS.
- Protect config.php and DB credentials.
- Sanitize inputs if exposing to public.

Deployment:
- Best on a shared hosting (cPanel) or VPS with Apache/Nginx + PHP + MySQL.

If you want, I can:
- Replace placeholders with your exact DB creds if you provide them (not recommended to share credentials here).
- Generate a short walkthrough showing how to import the SQL and configure config.php.
