module.exports = (sequelize, Sequelize) => {
    return sequelize.define("parcel", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        senderId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        receiverId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        length: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        width: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        height: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        weight: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        note: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        canceled: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    });
};