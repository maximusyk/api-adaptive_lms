"use strict";

const { DataType } = require("sequelize-typescript");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      const transitionHost = { transaction };
      return Promise.all([
        queryInterface.createTable(
          "cohesion_rates",
          {
            id: {
              type: DataType.UUID,
              unique: true,
              primaryKey: true,
              defaultValue: DataType.UUIDV4
            },
            assignedUnitId: {
              type: DataType.UUID,
              references: {
                model: "units",
                key: "id"
              }
            },
            cohesionUnitId: {
              type: DataType.UUID,
              references: {
                model: "units",
                key: "id"
              }
            },
            cohesionRate: {
              type: DataType.INTEGER,
              allowNull: false
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
        queryInterface.dropTable("cohesion_rates", transitionHost)
      ]);
    });
  }
};
