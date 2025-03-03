const express = require("express"); 
const router = express.Router(); 
const apiRouter = require("./api"); 
const apivnpay = require("./api/payment"); 

// Định tuyến cho API chính
router.use("/api", apiRouter);
router.use("/", apivnpay); 

// Kiểm tra nếu môi trường không phải production thì thêm một route để khôi phục CSRF token
if (process.env.NODE_ENV !== "production") {
  router.get("/api/csrf/restore", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken()); 
    return res.json({}); 
  });
}

// Các tuyến đường tĩnh phục vụ React frontend trong môi trường production
if (process.env.NODE_ENV === "production") {
  const path = require("path"); 

  // Route này phục vụ file index.html của frontend khi truy cập root "/"
  router.get("/", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken()); 
    return res.sendFile(
      path.resolve(__dirname, "../../frontend", "build", "index.html") // Trả về file index.html của frontend đã build
    );
  });

  // Cung cấp các tập tin tĩnh từ thư mục build của frontend
  router.use(express.static(path.resolve("../frontend/build")));

  // Route này đảm bảo bất kỳ tuyến đường nào không bắt đầu bằng "/api" sẽ trả về index.html
  // Điều này giúp React xử lý định tuyến phía client (Client-Side Routing)
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken()); 
    return res.sendFile(
      path.resolve(__dirname, "../../frontend", "build", "index.html")
    );
  });
}

// Một lần nữa kiểm tra nếu môi trường không phải production thì thêm route để khôi phục CSRF token
if (process.env.NODE_ENV !== "production") {
  router.get("/api/csrf/restore", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken()); 
    res.status(201).json({}); 
  });
}

module.exports = router; 
