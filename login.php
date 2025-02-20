<?php
// Kết nối đến MySQL
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "spotify";

$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}

// Xử lý đăng nhập
$message = "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Truy vấn kiểm tra tài khoản
    $sql = "SELECT * FROM users WHERE username = '$username' OR email = '$username'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        // Kiểm tra mật khẩu
        if ($password == $row['password']) { 
            echo "Đăng nhập thành công!";
            header("Location: home.php"); 
            exit();
        } else {
            $message = "Mật khẩu không đúng!";
        }
    } else {
        $message = "Tài khoản không tồn tại!";
    }
}

$conn->close();
?>





<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng Nhập</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(to bottom, #444, #000);
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .login-container {
            background-color: #121212;
            padding: 70px;
            border-radius: 10px;
            width: 400px;
            text-align: center;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }
        .logo {
            width: 100px;
            margin-bottom: 20px;
        }
        .social-buttons {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 50px;
            align-items: center;
        }
        .social-button {
            background: #121212;
            color: #fff;
            padding: 14px 0;
            border: 1px solid #353434;
            border-radius: 30px;
            font-size: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80%;
            font-weight: bold;
            transition: border-color 0.2s ease-in-out;
        }
        .social-button img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }
        .form-group {
            text-align: left;
            margin-bottom: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            width: 80%;
        }
        .form-group input {
            width: 80%;
            padding: 12px;
            border: 1px solid #555;
            border-radius: 5px;
            background-color: #121212;
            color: #ffffff;
            font-size: 14px;
            text-align: left;
        }
        .separator {
            display: flex;
            align-items: center;
            text-align: center;
            margin: 20px 0;
        }
        .separator::before, .separator::after {
            content: "";
            flex: 1;
            border-bottom: 1px solid #555;
        }
        .separator:not(:empty)::before {
            margin-right: .25em;
        }
        .separator:not(:empty)::after {
            margin-left: .25em;
        }
        .btn-login {
            background: #1DB954;
            color: #000000;
            padding: 14px 0;
            border: 1px solid #ece9e9;
            border-radius: 30px;
            font-size: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80%;
            font-weight: bold;
            margin: auto;
            transition: border-color 0.2s ease-in-out, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .signup-link {
            margin-top: 20px;
        }
        .signup-link a {
            color: #1DB954;
            text-decoration: none;
        }

        
        .social-button:hover, .btn-login:hover {
            border-color: #fff;
        }

        .btn-login:hover {
            box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="login-container">
        <img src="logo-new.png" alt="Spotify Logo" class="logo">
        <h1>Đăng nhập vào Spotify</h1>


        <!-- Hiển thị thông báo lỗi -->
        <?php if (!empty($message)) { echo "<p style='color: red;'>$message</p>"; } ?>

        
        <div class="social-buttons">
            <button class="social-button"><img src="logogg.jpg" alt="Google Logo">Tiếp tục bằng Google</button>
            <button class="social-button"><img src="logofb.jpg" alt="Facebook Logo">Tiếp tục bằng Facebook</button>
            <button class="social-button">Tiếp tục bằng số điện thoại</button>
        </div>
        <div class="separator"></div>
        <form action="login.php" method="POST">
            <div class="form-group">
                <label>Email hoặc tên người dùng</label>
                <input type="text" name="username" placeholder="Email hoặc tên người dùng" required>
            </div>
            <div class="form-group">
                <label>Mật khẩu</label>
                <input type="password" name="password" placeholder="Nhập mật khẩu" required>
            </div>
            <button class="btn-login" type="submit">Tiếp tục</button>
        </form>
        <div class="signup-link">
            <p>Bạn chưa có tài khoản? <a href="#">Đăng ký Spotify</a></p>
        </div>
    </div>
</body>
</html>
