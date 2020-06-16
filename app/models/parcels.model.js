module.exports = (sequelize, Sequelize) => {
    const Accounts = require('../component/resilient.component');
    const mailer = require('../component/nodemailer.component');

    return sequelize.define("parcel", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        sender: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        receiver: {
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
    }, {
        hooks: {
            afterCreate: (parcel) => {
                const proxy = Accounts.resilient("ACCOUNT-SERVICE");
                proxy.post('/accounts/join/accountId', {data: [parcel.dataValues.sender]}).then(response => {
                    if (response.status < 300) mailer.sendHTMLMaile("./resources/templates/parcelNotification.ejs", {}, {to: response.data.pop().email, subject: 'Balík je pripravený na expedíciu'});
                });
            }
        }
    });
};