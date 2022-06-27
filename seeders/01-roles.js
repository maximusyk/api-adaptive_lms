"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const date = new Date;
    const roles = [
      {
        id: "2ffa3004-101b-4050-946d-5417337c2bca",
        title: "Admin",
        createdAt: date,
        updatedAt: date
      },
      {
        id: "0faf3804-185e-429d-85c8-42d7463d42fa",
        title: "Professor",
        createdAt: date,
        updatedAt: date
      },
      {
        id: "0d771e4f-5132-4c49-a6ef-67c68c138357",
        title: "Student",
        createdAt: date,
        updatedAt: date
      }
    ];

    await queryInterface.bulkInsert("roles", roles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  }
};
