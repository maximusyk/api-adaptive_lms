"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const date = new Date;
    const quizQuestionTypes = [
      {
        id: "a072d9ef-9f6d-425a-a954-4c7e2aa864ca",
        title: "Single Choice",
        createdAt: date,
        updatedAt: date
      },
      {
        id: "6c3b05be-01f2-43b8-99dc-7af07aa07519",
        title: "Multiple Choice",
        createdAt: date,
        updatedAt: date
      },
      {
        id: "09605881-ee80-41a2-8682-9016fec7691c",
        title: "Text Input",
        createdAt: date,
        updatedAt: date
      }
    ];

    await queryInterface.bulkInsert("quiz_question_types", quizQuestionTypes, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("quiz_question_types", null, {});
  }
};
