"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("MyAlbums", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Kết nối đến bảng Users
          key: "id",
        },
        onDelete: "CASCADE",
      },
      songid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Songs", // Kết nối đến bảng Songs
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("MyAlbums");
  },
};
