const { validationResult } = require("express-validator"); 
// lấy kết quả de kiểm tra dữ liệu đầu vào.

// Middleware để xử lý lỗi validation từ express-validator
const handleValidationErrors = (req, _res, next) => {
  // Lấy danh sách lỗi từ request sau khi kiểm tra
  const validationErrors = validationResult(req);

  // kiểm tra nếu có lỗi validation
  if (!validationErrors.isEmpty()) {
    // thông báo lỗi
    const errors = validationErrors.array().map((error) => `${error.msg}`);

    // Tạo một đối tượng lỗi mới với thông tin chi tiết
    const err = Error("Bad request."); 
    err.errors = errors; 
    err.status = 400; 
    err.title = "Bad request.";

    next(err); 
  }

  next(); 
};

module.exports = {
  handleValidationErrors,
};
