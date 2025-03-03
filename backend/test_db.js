const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("postgres", "postgres", "mysecurepassword", {
    host: "localhost",
    dialect: "postgres",
    port: 5432,
    logging: console.log,
  });
  

sequelize
  .authenticate()
  .then(() => console.log("✅ Kết nối thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối:", err));
