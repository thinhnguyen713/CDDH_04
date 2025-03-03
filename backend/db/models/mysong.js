module.exports = (sequelize, DataTypes) => {
  const MySong = sequelize.define(
    "MySong",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: { // 🔥 Sequelize vẫn dùng "userId" nhưng ánh xạ đúng cột "userid" trong DB
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        field: "userid", // ✅ Khớp với cột "userid" trong DB
      },
      songId: { // 🔥 Tương tự cho songId -> songid
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Songs", key: "id" },
        field: "songid", // ✅ Khớp với cột "songid" trong DB
      },
    },
    {
      timestamps: true,
      freezeTableName: true
    }
  );

  return MySong;
};
