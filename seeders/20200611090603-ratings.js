module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('ratings', [{
            name: 'John Doe',
            isBetaMember: false
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('ratings', null, {});
    }
};