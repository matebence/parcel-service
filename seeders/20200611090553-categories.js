module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('categories', [{
            name: 'Dokumenty',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'Potraviny',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'Elektronika',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'Oblečenie',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'Drogéria',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'Iné',
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('categories', null, {});
    }
};