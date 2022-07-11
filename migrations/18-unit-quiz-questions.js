'use strict';

const { DataType } = require('sequelize-typescript');
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((transaction) => {
            const transitionHost = { transaction };
            return Promise.all([
                queryInterface.createTable(
                    'unit_quiz_questions',
                    {
                        id: {
                            type: DataType.UUID,
                            unique: true,
                            primaryKey: true,
                            defaultValue: DataType.UUIDV4
                        },
                        unitId: {
                            type: DataType.UUID,
                            allowNull: false,
                            references: {
                                model: 'units',
                                key: 'id'
                            }
                        },
                        quizQuestionId: {
                            type: DataType.UUID,
                            allowNull: false,
                            references: {
                                model: 'quiz_questions',
                                key: 'id'
                            }
                        },
                        createdAt: {
                            type: DataType.DATE,
                            allowNull: false
                        },
                        updatedAt: {
                            type: DataType.DATE,
                            allowNull: false
                        },
                        deletedAt: {
                            type: DataType.DATE
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
                queryInterface.dropTable('unit_quiz_questions', transitionHost)
            ]);
        });
    }
};
