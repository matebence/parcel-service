module.exports = (app, config) => {
    const Sequelize = require("sequelize");
    const strings = require('../../resources/strings');

    const sequelize = new Sequelize(config.get('node.datasource.database'), config.get('node.datasource.username'), config.get('node.datasource.password'), {
        host: config.get('node.datasource.host'),
        dialect: config.get('node.datasource.dialect'),
        define: {
            charset: config.get('node.datasource.charset'),
            collate: config.get('node.datasource.encoding'),
            timestamps: true,
            paranoid: true
        }
    });

    sequelize.sync({force: config.get('node.sequelize.create-drop')})
        .then(result => {
        }).catch(error => {
        console.log(strings.DATABASE_STRUCTURE_ERR)
    });

    const database = {};
    database.Sequelize = Sequelize;
    database.sequelize = sequelize;

    module.exports = database;
};