"use strict";

const { DataType } = require("sequelize-typescript");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      const transitionHost = { transaction };
      return Promise.all([
        queryInterface.createTable(
          "chapters",
          {
            id: {
              type: DataType.UUID,
              unique: true,
              primaryKey: true,
              defaultValue: DataType.UUIDV4
            },
            title: {
              type: DataType.STRING,
              allowNull: false
            },
            courseId: {
              type: DataType.UUID,
              references: {
                model: "courses",
                key: "id"
              }
            },
            createdAt: {
              type: Sequelize.DATE
            },
            updatedAt: {
              type: Sequelize.DATE
            },
            deletedAt: {
              type: Sequelize.DATE
            }
          }
          ,
          transitionHost
        )
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      const transitionHost = { transaction };
      return Promise.all([
        queryInterface.dropTable("chapters", transitionHost)
      ]);
    });
  }
};
