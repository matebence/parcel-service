module.exports = (sequelize, Sequelize) => {
    return sequelize.define("invoice", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        invoice: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        uniqueKeys: {
            Items_unique: {
                fields: ['invoice']
            }
        }
    });
};