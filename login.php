<?php
// Kết nối cơ sở dữ liệu
$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "spotify"; 

// kết nối sqlsql
$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Xử lý đăng nhập
$message = "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $conn->real_escape_string($_POST['username']);
    $password = $conn->real_escape_string($_POST['password']);

    // Truy vấn kiểm tra thông tin đăng nhập
    $sql = "SELECT * FROM users WHERE username='$username' AND password='$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Đăng nhập thành công
        $message = "Đăng Nhập Thành CôngCông!";
        // Chuyển hướng đến trang chính hoặc thực hiện các hành động khác
    } else {
        // Đăng nhập thất bại
        $message = "Kiểm tra lại thông tin đăng nhập!";
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spotify Login</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #121212;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .login-container {
            background-color: #181818;
            padding: 40px;
            border-radius: 10px;
            width: 300px;
            text-align: center;
        }

        .logo img {
            width: 100px;
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 15px;
            text-align: left;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
        }

        .form-group input {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background-color: #333;
            color: #fff;
        }

        button {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background-color: #1DB954;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
        }

        button:hover {
            background-color: #1ed760;
        }

        .signup-link {
            margin-top: 20px;
        }

        .signup-link a {
            color: #1DB954;
            text-decoration: none;
        }

        .signup-link a:hover {
            text-decoration: underline;
        }

        .message {
            color: #ff0000;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <img src="" alt="Spotify Logo">
        </div>
        <form action="images\logo-new.png" method="POST">
            <div class="form-group">
                <label for="username">Username or Email</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Log In</button>
        </form>
        <div class="signup-link">
            <p>Don't have an account? <a href="#">Sign up for Spotify</a></p>
        </div>
        <div class="message"><?php echo $message; ?></div>
    </div>
</body>
</html>