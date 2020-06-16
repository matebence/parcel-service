module.exports = (app, config) => {
    const Sequelize = require("sequelize");
    const strings = require('../../resources/strings');
    const redis = require("redis");

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

    const redisClient = redis.createClient({
        host: config.get('node.datasource.redis.host'),
        port: config.get('node.datasource.redis.port'),
        password: config.get('node.datasource.redis.password')
    }).on("error", (error) => {
        console.log(`${strings.REDIS_DATABASE_CONNECTION_ERROR} ${config.get('node.datasource.redis.host')}:${config.get('node.datasource.redis.port')}`);
    });

    sequelize.sync({force: config.get('node.sequelize.create-drop')}).then(result => {
        console.log(strings.DATABASE_STRUCTURE)
    }).catch(error => {
        console.log(error);
        console.log(strings.DATABASE_STRUCTURE_ERR)
    });

    const database = {};
    database.Sequelize = Sequelize;
    database.sequelize = sequelize;
    database.redis = redisClient;

    database.categories = require("./categories.model")(sequelize, Sequelize);
    database.invoices = require("./invoices.model")(sequelize, Sequelize);
    database.parcels = require("./parcels.model")(sequelize, Sequelize);
    database.ratings = require("./ratings.model")(sequelize, Sequelize);

    database.parcels.hasOne(database.invoices, {foreignKey: 'parcelId', constraints: true});
    database.categories.hasOne(database.parcels, {foreignKey: 'categoryId', constraints: true});
    database.parcels.hasOne(database.ratings, {foreignKey: 'parcelId', constraints: true});

    database.ratings.belongsTo(database.parcels);
    database.parcels.belongsTo(database.categories);
    database.invoices.belongsTo(database.parcels);

    module.exports = database;
};