const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const bodyParser = require("body-parser");

const { environment } = require("./config");
const isProduction = environment === "production";

const app = express();

// 🔹 Middleware chung
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 🔹 Chỉ bật CORS khi không phải production
if (!isProduction) {
  app.use(cors());
}

// 🔹 Bảo mật với Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// ✅ CSRF Protection: Chỉ áp dụng cho POST, PUT (Bỏ qua GET, DELETE)
const csrfProtection = csurf({
  cookie: {
    secure: isProduction,
    sameSite: isProduction && "Lax",
    httpOnly: true, // ⚠️ Nên đặt true để bảo mật hơn
  },
});

// 🔹 Áp dụng CSRF middleware TRƯỚC KHI dùng req.csrfToken()
app.use((req, res, next) => {
  if (req.method === "GET" || req.method === "DELETE"||req.method === "POST") {
    return next();
  }
  return csrfProtection(req, res, next);
});

// ✅ Định nghĩa API lấy CSRF Token sau khi middleware CSRF đã được thiết lập
app.get("/api/csrf/restore", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


// 🔹 Kết nối routes
app.use(routes);

const paymentRoutes = require('./routes/api/payment');
app.use('/vnpay', paymentRoutes);

// 🚨 Xử lý lỗi 404 (Route không tồn tại)
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});

// 🚨 Xử lý lỗi chung (Global Error Handler)
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors || [],
    stack: isProduction ? null : err.stack,
  });
});


module.exports = app;
