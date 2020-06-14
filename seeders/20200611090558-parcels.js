module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('parcels', [{
            senderId: 3,
            receiverId: 5,
            categoryId: 3,
            length: 15,
            width: 10,
            height: 5,
            weight: 250,
            note: "Enean auctor commodo elit eget consectetur. Etiam in tempor eros. Etiam eleifend neque laoreet, suscipit diam at, sodales purus. Nulla id varius ante.",
            canceled: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('parcels', null, {});
    }
};