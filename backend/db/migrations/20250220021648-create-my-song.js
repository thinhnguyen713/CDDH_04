module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("MySong", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userid: { // ✅ Giữ nguyên "userid" như model
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      songid: { // ✅ Giữ nguyên "songid" như model
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Songs",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // ✅ Thêm giá trị mặc định
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // ✅ Thêm giá trị mặc định
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"), // ✅ Cập nhật khi có thay đổi
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("MySong");
  },
};
