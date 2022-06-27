"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const date = new Date;
    const users = [ {
      id: "504b3df5-bfb2-4aa9-86be-2cf273ae55d5",
      firstName: "Maksym",
      lastName: "Usyk",
      username: "maksym.usyk",
      password: "$2a$10$ATydTo0HWsVDxx8l8ldVOuvWrp3yFIPNz.Y3m9dFt4iB82loOF2LC",
      email: "22usyk08@gmail.com",
      phone: "+380111002111",
      roleId: "2ffa3004-101b-4050-946d-5417337c2bca",
      createdAt: date,
      updatedAt: date
    } ];

    const userRoles = [
      {
        id: "e0dc75da-6ac2-4ad9-9838-81d8a8213a67",
        roleId: "2ffa3004-101b-4050-946d-5417337c2bca",
        userId: "504b3df5-bfb2-4aa9-86be-2cf273ae55d5"
      }
    ];

    await queryInterface.bulkInsert("users", users, {});
    await queryInterface.bulkInsert("user_roles", userRoles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  }
};
