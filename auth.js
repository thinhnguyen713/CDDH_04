const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");
const { secret, expiresIn } = jwtConfig;

// Kiểm tra và xử lý expiresIn để loại bỏ ký tự không hợp lệ (như 's') và đảm bảo là số
const expiresInSeconds = parseInt(expiresIn.replace(/[^\d]/g, ""), 10);

// Kiểm tra xem expiresIn có phải là số hợp lệ hay không
if (isNaN(expiresInSeconds)) {
  throw new Error("JWT_EXPIRES_IN must be a valid number.");
}

// Send a JWT cookie
const setTokenCookie = (res, user) => {
  // Tạo token JWT
  const token = jwt.sign(
    { data: user.toSafeObject() },
    secret,
    { expiresIn: expiresInSeconds } // expiresIn sử dụng giá trị đã xử lý
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Thiết lập cookie token
  res.cookie("token", token, {
    maxAge: expiresInSeconds * 1000, // maxAge được tính bằng milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // Lấy token từ cookies
  const { token } = req.cookies;

  // Kiểm tra và xác thực token
  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.scope("currentUser").findByPk(id);
    } catch (e) {
      res.clearCookie("token");
      return next();
    }

    if (!req.user) res.clearCookie("token");

    return next();
  });
};

// Middleware yêu cầu xác thực người dùng
const requireAuth = [
  restoreUser,
  function (req, res, next) {
    if (req.user) return next();

    const err = new Error("Unauthorized");
    err.title = "Unauthorized";
    err.errors = ["Unauthorized"];
    err.status = 401;
    return next(err);
  },
];

module.exports = { setTokenCookie, restoreUser, requireAuth };
