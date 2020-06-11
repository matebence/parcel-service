module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('invoices', [{
            invoice: 'parcel-4-1-1591868749.pdf',
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('invoices', null, {});
    }
};