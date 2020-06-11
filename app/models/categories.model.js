module.exports = (sequelize, Sequelize) => {
    return sequelize.define("category", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        uniqueKeys: {
            Items_unique: {
                fields: ['name']
            }
        }
    });
};