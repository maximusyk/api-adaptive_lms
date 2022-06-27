"use strict";

const { DataType } = require("sequelize-typescript");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      const transitionHost = { transaction };
      return Promise.all([
        queryInterface.createTable(
          "lectures",
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
            fileId: {
              type: DataType.STRING,
              allowNull: false
            },
            isActive: {
              type: DataType.BOOLEAN,
              allowNull: false,
              defaultValue: false
            },
            chapterId: {
              type: DataType.UUID,
              references: {
                model: "chapters",
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
        queryInterface.dropTable("lectures", transitionHost)
      ]);
    });
  }
};
