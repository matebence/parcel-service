module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('parcels', [{
            name: 'John Doe',
            isBetaMember: false
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('parcels', null, {});
    }
};