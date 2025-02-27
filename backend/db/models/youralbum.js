module.exports = (sequelize, DataTypes) => {
  const YourAlbum = sequelize.define(
    "YourAlbum",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "userid", // 👈 Match với database
        references: { model: "Users", key: "id" },
      },
      songId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "songid", // 👈 Match với database
        references: { model: "Songs", key: "id" },
      },
    },
    {
      timestamps: false,
      tableName: "YourAlbum", // 👈 Đảm bảo Sequelize dùng đúng tên bảng
    }
  );

  return YourAlbum;
};
