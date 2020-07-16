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
                proxy.post('/accounts/join/accountId', {data: {ids: [parcel.dataValues.sender, parcel.dataValues.receiver]}}).then(response => {
                    if (response.status < 300) {
                        response.data.forEach(e => {
                            if (e.accountId === parcel.dataValues.sender) mailer.sendHTMLMaile("parcelNotification.ejs", {title: "Vaša požiadavka bola spracovaná", text: "Vami zvolený kuriér, čoskoro príde aby vyzdvihol balík"}, {to: e.email, subject: 'Nový balík'});
                            if (e.accountId === parcel.dataValues.receiver) mailer.sendHTMLMaile("parcelNotification.ejs", {title: "Bola Vám pridelená zásielka", text: "Čoskoro bude Vám doručený balík"}, {to: e.email, subject: 'Nová zásielka'});
                        });
                    }
                });
            }
        }
    });
};