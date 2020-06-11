module.exports = (sequelize, Sequelize) => {
    return sequelize.define("rating", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        rating: {
            type:   Sequelize.ENUM,
            values: ['1', '2', '3', '4', '5'],
            allowNull: false
        },
        image: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    });
};