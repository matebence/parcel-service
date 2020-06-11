module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('invoices', [{
            name: 'John Doe',
            isBetaMember: false
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('invoices', null, {});
    }
};