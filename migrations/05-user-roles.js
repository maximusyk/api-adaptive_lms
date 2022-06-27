"use strict";

const { DataType } = require("sequelize-typescript");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      const transitionHost = { transaction };
      return Promise.all([
        queryInterface.createTable(
          "user_roles",
          {
            id: {
              type: DataType.UUID,
              unique: true,
              primaryKey: true,
              defaultValue: DataType.UUIDV4
            },
            roleId: {
              type: DataType.UUID,
              references: {
                model: "roles",
                key: "id"
              }
            },
            userId: {
              type: DataType.UUID,
              references: {
                model: "users",
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
        queryInterface.dropTable("user_roles", transitionHost)
      ]);
    });
  }
};
