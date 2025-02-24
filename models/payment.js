"use strict";
const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        },
        field: "userid", // Sửa lỗi từ `filed` thành `field`
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
          min: 0.01,
        },
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 3], // ISO 4217 currency code (e.g., USD, EUR)
        },
      },
      paymentmethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "pending",
      },
      expiresat: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("NOW() + interval '30 days'"),
        field: "expiresat",
      },
      createdat: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "createdat",
      },
      updatedat: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "updatedat",
      },
    },
    {
      timestamps: true, // Bật timestamps nhưng dùng tên cột tùy chỉnh
      createdAt: "createdat", // Sử dụng tên cột tùy chỉnh thay vì mặc định `createdAt`
      updatedAt: "updatedat", // Sử dụng tên cột tùy chỉnh thay vì mặc định `updatedAt`
      defaultScope: {
        attributes: { exclude: ["createdat", "updatedat"] },
      },
      scopes: {
        detailed: { attributes: {} },
      },
    }
  );

  // Định nghĩa mối quan hệ
  Payment.associate = function (models) {
    Payment.belongsTo(models.User, { foreignKey: "userid" });
  };

  // Lấy payment theo ID
  Payment.getPaymentById = async function (id) {
    return await Payment.findByPk(id);
  };

  // Tạo payment mới
  Payment.createPayment = async function ({ userId, amount, currency, paymentMethod }) {
    return await Payment.create({
      userId,
      amount,
      currency,
      paymentMethod,
      status: "pending",
      expiresat: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày sau
    });
  };

  // Cập nhật trạng thái thanh toán
  Payment.updatePaymentStatus = async function (id, status) {
    const payment = await Payment.findByPk(id);
    if (payment) {
      payment.status = status;
      await payment.save();
    }
    return payment;
  };

  // Kiểm tra xem user có premium hay không
  Payment.isUserPremium = async function (userid) {
    try {
      const latestPayment = await Payment.findOne({
        where: {
          userid,
          status: "completed",
          expiresat: {
            [Op.gt]: new Date(), // Chỉ lấy giao dịch chưa hết hạn
          },
        },
        order: [["expiresat", "DESC"]], // Lấy giao dịch mới nhất
      });

      return !!latestPayment; // Trả về true nếu có gói premium hợp lệ, ngược lại false
    } catch (error) {
      console.error("Error checking premium status:", error);
      return false;
    }
  };

  return Payment;
};
