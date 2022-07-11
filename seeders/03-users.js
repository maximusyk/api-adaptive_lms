'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const date = new Date;
        const users = [
            {
                id: '504b3df5-bfb2-4aa9-86be-2cf273ae55d5',
                firstName: 'Maksym',
                lastName: 'Usyk',
                username: 'maksym.usyk',
                password: '$2a$10$ATydTo0HWsVDxx8l8ldVOuvWrp3yFIPNz.Y3m9dFt4iB82loOF2LC',
                email: '22usyk08@gmail.com',
                phone: '+380111111111',
                roleId: '2ffa3004-101b-4050-946d-5417337c2bca',
                createdAt: date,
                updatedAt: date,
            },
            {
                id: '0a187421-659c-4ba3-a2dc-e124f024a63b',
                firstName: 'Tony',
                lastName: 'Stark',
                username: 'tony.stark',
                password: '$2a$10$fQoU5GYov1m/pUZYQLijzungwsw8/Cv9dPlJvcEzlHnupEYgTWiH6',
                email: 'tony.stark@gmail.com',
                phone: '+380222222222',
                roleId: '0faf3804-185e-429d-85c8-42d7463d42fa',
                createdAt: date,
                updatedAt: date,
            },
            {
                id: '9e5c6460-40bf-4069-9995-2224b77745f9',
                firstName: 'Yurii',
                lastName: 'Bodnar',
                username: 'yurii.bodnar',
                password: '$2a$10$ww1NmMXmbx67PW/SO2mr7uoxlwr4gX7czVGWi3W2fTXOS2iKW15py',
                email: 'yurii.bodnar@gmail.com',
                phone: '+380333333333',
                roleId: '0d771e4f-5132-4c49-a6ef-67c68c138357',
                createdAt: date,
                updatedAt: date,
            },
        ];

        const userRoles = [
            {
                id: '504b3df5-bfb2-4aa9-86be-2cf273ae55d5',
                userId: '504b3df5-bfb2-4aa9-86be-2cf273ae55d5', // maksym.usyk
                roleId: '2ffa3004-101b-4050-946d-5417337c2bca', // admin
            },
            {
                id: '489529df-5e0b-4cca-9285-415b44882659',
                userId: '0a187421-659c-4ba3-a2dc-e124f024a63b', // tony.stark
                roleId: '0faf3804-185e-429d-85c8-42d7463d42fa', // professor
            },
            {
                id: '40e54c4f-4809-46af-80c0-0d051434b71e',
                userId: '9e5c6460-40bf-4069-9995-2224b77745f9', // yurii.bodnar
                roleId: '0d771e4f-5132-4c49-a6ef-67c68c138357', // student
            },
        ];

        await queryInterface.bulkInsert('users', users, {});
        await queryInterface.bulkInsert('user_roles', userRoles, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
    },
};
