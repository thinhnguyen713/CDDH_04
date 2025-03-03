const jwt = require("jsonwebtoken"); 
const { jwtConfig } = require("../config"); 
const { User } = require("../db/models"); 
const { secret, expiresIn } = jwtConfig; 

// Kiểm tra để loại bỏ ký tự không hợp lệ 
const expiresInSeconds = parseInt(expiresIn.replace(/[^\d]/g, ""), 10);

// Kiểm tra xem expiresIn có phải là số hợp lệ hay không
if (isNaN(expiresInSeconds)) {
  throw new Error("JWT_EXPIRES_IN must be a valid number.");
}

const setTokenCookie = (res, user) => {

  const token = jwt.sign(
    { data: user.toSafeObject() }, 
    secret, 
    { expiresIn: expiresInSeconds } 
  );

  const isProduction = process.env.NODE_ENV === "production"; 

  res.cookie("token", token, {
    maxAge: expiresInSeconds * 1000,
    httpOnly: true, 
    secure: isProduction, 
    sameSite: isProduction && "Lax", 
  });

  return token; 
};

// Middleware khôi phục thông tin người dùng từ token
const restoreUser = (req, res, next) => {
  
  const { token } = req.cookies;

  // Kiểm tra và xác thực token JWT
  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next(); 
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.scope("currentUser").findByPk(id); 
    } catch (e) {
      res.clearCookie("token"); // Nếu có lỗi khi tìm user, xóa token cookie
      return next();
    }

    if (!req.user) res.clearCookie("token"); // Nếu user không tồn tại, xóa token cookie

    return next(); 
  });
};

// Middleware yêu cầu xác thực người dùng trước khi truy cập tài nguyên
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