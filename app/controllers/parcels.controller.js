const {validationResult, check} = require('express-validator/check');
const crypto = require('crypto-js');

const strings = require('../../resources/strings');
const database = require("../models");

const Users = require('../component/resilient.component');
const Parcels = database.parcels;
const Ratings = database.ratings;
const Op = database.Sequelize.Op;

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;

exports.create = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_CLIENT'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    checkBody: (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                message: strings.SERVER_REQUEST_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    validate: [
        check('sender')
            .isInt({min: 1}).withMessage(strings.PARCEL_SENDER_ID_INT),
        check('receiver')
            .isInt({min: 1}).withMessage(strings.PARCEL_RECEIVER_ID_INT),
        check('categoryId')
            .isInt({min: 1}).withMessage(strings.PARCEL_CATEGORY_ID_INT),
        check('length')
            .isFloat().withMessage(strings.PARCEL_LENGHT_FLOAT),
        check('width')
            .isFloat().withMessage(strings.PARCEL_WIDTH_FLOAT),
        check('height')
            .isFloat().withMessage(strings.PARCEL_HEIGHT_FLOAT),
        check('weight')
            .isFloat().withMessage(strings.PARCEL_WEIGHT_FLOAT),
        check('note')
            .matches(/[^\x00-\x7F]|[a-zA-Z0-9]|[$&:;=?@#.()%!-]/).withMessage(strings.PARCEL_NOTE_MATCHES),
        check('canceled')
            .isBoolean().withMessage(strings.PARCEL_CANCELED_BOOLEAN),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        return database.sequelize.transaction((t) => {
            return Parcels.create(req.body, {transaction: t});
        }).then(data => {
            return res.status(201).json(data, [
                {rel: "parcel", method: "GET", href: `${req.protocol}://${req.get('host')}/api/parcels/${data.id}`}]);
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.CREATE_PARCEL_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    }
};

exports.delete = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    validate: [
        check('id')
            .isInt({min: 1}).withMessage(strings.PARCEL_ID_INT),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        return database.sequelize.transaction((t) => {
            return Promise.all([
                Parcels.destroy({where: {id: req.params.id}}, {transaction: t}),
                Ratings.destroy({where: {parcelId: req.params.id}}, {transaction: t})
            ]);
        }).then(num => {
            if (num.every(number => number > 0)) {
                return res.status(200).json({});
            } else {
                return res.status(400).json({
                    timestamp: new Date().toISOString(),
                    message: strings.GET_PARCEL_ERR,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.DELETE_PARCEL_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    }
};

exports.update = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_CLIENT'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    checkBody: (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                message: strings.SERVER_REQUEST_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    validate: [
        check('id')
            .isInt({min: 1}).withMessage(strings.PARCEL_ID_INT),
        check('sender')
            .isInt({min: 1}).withMessage(strings.PARCEL_SENDER_ID_INT),
        check('receiver')
            .isInt({min: 1}).withMessage(strings.PARCEL_RECEIVER_ID_INT),
        check('categoryId')
            .isInt({min: 1}).withMessage(strings.PARCEL_CATEGORY_ID_INT),
        check('length')
            .isFloat().withMessage(strings.PARCEL_LENGHT_FLOAT),
        check('width')
            .isFloat().withMessage(strings.PARCEL_WIDTH_FLOAT),
        check('height')
            .isFloat().withMessage(strings.PARCEL_HEIGHT_FLOAT),
        check('weight')
            .isFloat().withMessage(strings.PARCEL_WEIGHT_FLOAT),
        check('note')
            .matches(/[^\x00-\x7F]|[a-zA-Z0-9]|[$&:;=?@#.()%!-]/).withMessage(strings.PARCEL_NOTE_MATCHES),
        check('canceled')
            .isBoolean().withMessage(strings.PARCEL_CANCELED_BOOLEAN),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        return database.sequelize.transaction((t) => {
            return Parcels.update(req.body, {
                where: {id: req.params.id}
            }, {transaction: t});
        }).then(num => {
            if (num === 1) {
                return res.status(200).json({});
            } else {
                return res.status(400).json({
                    timestamp: new Date().toISOString(),
                    message: strings.GET_PARCEL_ERR,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.UPDATE_PARCEL_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    }
};

exports.get = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_CLIENT'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    validate: [
        check('id')
            .isInt({min: 1}).withMessage(strings.PARCEL_ID_INT),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        return database.sequelize.transaction((t) => {
            return Parcels.findByPk(req.params.id,
                {include: [database.categories], transaction: t});
        }).then(data => {
            if (data) {
                req.parcels = data;
                req.hateosLinks = [
                    {rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl},
                    {rel: "all-parcels", method: "GET", href: `${req.protocol}://${req.get('host')}/api/parcels/page/${DEFAULT_PAGE_NUMBER}/limit/${DEFAULT_PAGE_SIZE}`}];
                next();
            } else {
                return res.status(400).json({
                    timestamp: new Date().toISOString(),
                    message: strings.GET_PARCEL_ERR,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.PARCEL_NOT_FOUND,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    },
    fetchDataFromService: (req, res, next) => {
        const proxy = Users.resilient("USER-SERVICE");
        const users = [req.parcels.sender, req.parcels.receiver];

        proxy.post('/users/join/accountId', {data: users}).then(response => {
            if (response.status >= 300 && !'error' in response.data) return new Error(strings.PROXY_ERR);
            response.data.forEach(e => {database.redis.setex(crypto.MD5(`users-${e.accountId}`).toString(), 3600, JSON.stringify(e))});

            const parcels = [req.parcels].map(e => {
                const sender = response.data.find(x => x.accountId === e.sender);
                const receiver = response.data.find(x => x.accountId === e.receiver);

                return {...e.dataValues, sender: {senderId: e.sender, name:`${sender.firstName} ${sender.lastName}`, tel: sender.tel, places: sender.places, userName: sender.userName, email: sender.email}, receiver: {receiverId: e.receiver, name:`${receiver.firstName} ${receiver.lastName}`, tel: receiver.tel, places: receiver.places, userName: receiver.userName, email: receiver.email}};
            }).pop();

            return res.status(200).json(parcels, req.hateosLinks);
        }).catch(err => {
            req.cacheId = users;
            next();
        });
    },
    fetchDataFromCache: (req, res, next) => {
        database.redis.mget(req.cacheId.map(e => {return crypto.MD5(`users-${e}`).toString()}), (err, data) => {
            if (!data) {
                return res.status(500).json({
                    timestamp: new Date().toISOString(),
                    message: strings.PARCEL_NOT_FOUND,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            } else{
                try{
                    data = JSON.stringify(data.map(e => {return JSON.parse(e)}));
                    const parcels = [req.parcels].map(e => {
                        const parsedData = JSON.parse(data);
                        const sender = parsedData.find(x => x.accountId === e.sender);
                        const receiver = parsedData.find(x => x.accountId === e.receiver);

                        return {...e.dataValues, sender: {senderId: e.sender, name:`${sender.firstName} ${sender.lastName}`, tel: sender.tel, places: sender.places, userName: sender.userName, email: sender.email}, receiver: {receiverId: e.receiver, name:`${receiver.firstName} ${receiver.lastName}`, tel: receiver.tel, places: receiver.places, userName: receiver.userName, email: receiver.email}};
                    }).pop();

                    return res.status(200).json(parcels, req.hateosLinks);
                }catch(err){
                    return res.status(500).json({
                        timestamp: new Date().toISOString(),
                        message: strings.PARCEL_NOT_FOUND,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                }
            }
        });
    }
};

exports.getAll = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_CLIENT'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    validate: [
        check('pageNumber')
            .isInt({min: 1}).withMessage(strings.PARCEL_PAGE_NUMBER_INT),
        check('pageSize')
            .isInt({min: 1}).withMessage(strings.PARCEL_PAGE_SIZE_INT),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        return database.sequelize.transaction((t) => {
            return Parcels.findAll({
                offset: (Number(req.params.pageNumber) - 1) * Number(req.params.pageSize),
                limit: Number(req.params.pageSize),
                order: [['createdAt', 'ASC']],
                include: [database.categories]
            }, {transaction: t});
        }).then(data => {
            if (data.length > 0 || data !== undefined) {
                req.parcels = data;
                req.hateosLinks = [
                    {rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl},
                    {rel: "next-range", method: "GET", href: `${req.protocol}://${req.get('host')}/api/parcels/page/${1 + Number(req.params.pageNumber)}/limit/${req.params.pageSize}`}];
                next();
            } else {
                return res.status(400).json({
                    timestamp: new Date().toISOString(),
                    message: strings.PARCEL_NOT_FOUND,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.PARCEL_NOT_FOUND,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    },
    fetchDataFromService: (req, res, next) => {
        const proxy = Users.resilient("USER-SERVICE");
        let users = req.parcels.filter(e => e.sender && e.receiver).map(x => [x.sender, x.receiver]);
        users = [...new Set(users.reduce((acc, val) => [ ...acc, ...val ], []))];

        proxy.post('/users/join/accountId', {data: users}).then(response => {
            if (response.status >= 300 && !'error' in response.data) return new Error(strings.PROXY_ERR);
            response.data.forEach(e => {database.redis.setex(crypto.MD5(`users-${e.accountId}`).toString(), 3600, JSON.stringify(e))});

            const parcels = req.parcels.map(e => {
                const sender = response.data.find(x => x.accountId === e.sender);
                const receiver = response.data.find(x => x.accountId === e.receiver);

                return {...e.dataValues, sender: {senderId: e.sender, name:`${sender.firstName} ${sender.lastName}`, tel: sender.tel, places: sender.places, userName: sender.userName, email: sender.email}, receiver: {receiverId: e.receiver, name:`${receiver.firstName} ${receiver.lastName}`, tel: receiver.tel, places: receiver.places, userName: receiver.userName, email: receiver.email}};
            });

            return res.status(206).json({data: parcels}, req.hateosLinks);
        }).catch(err => {
            req.cacheId = users;
            next();
        });
    },
    fetchDataFromCache: (req, res, next) => {
        database.redis.mget(req.cacheId.map(e => {return crypto.MD5(`users-${e}`).toString()}), (err, data) => {
            if (!data) {
                return res.status(500).json({
                    timestamp: new Date().toISOString(),
                    message: strings.PARCEL_NOT_FOUND,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            } else {
                try{
                    data = JSON.stringify(data.map(e => {return JSON.parse(e)}));
                    const parcels = req.parcels.map(e => {
                        const parsedData = JSON.parse(data);
                        const sender = parsedData.find(x => x.accountId === e.sender);
                        const receiver = parsedData.find(x => x.accountId === e.receiver);

                        return {...e.dataValues, sender: {senderId: e.sender, name:`${sender.firstName} ${sender.lastName}`, tel: sender.tel, places: sender.places, userName: sender.userName, email: sender.email}, receiver: {receiverId: e.receiver, name:`${receiver.firstName} ${receiver.lastName}`, tel: receiver.tel, places: receiver.places, userName: receiver.userName, email: receiver.email}};
                    });

                    return res.status(206).json({data: parcels}, req.hateosLinks);
                } catch(err) {
                    return res.status(500).json({
                        timestamp: new Date().toISOString(),
                        message: strings.PARCEL_NOT_FOUND,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                }
            }
        });
    }
};

exports.search = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_CLIENT'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    checkBody: (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                message: strings.SERVER_REQUEST_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    inDatabase: (req, res, next) => {
        const pagination = req.body.pagination;
        let order = [];
        let search = [];
        let hateosLinks = [];

        if (req.body.orderBy) {
            for (let key in req.body.orderBy) {
                order.push([key, req.body.orderBy[key]]);
            }
        }
        if (req.body.search) {
            for (let key in req.body.search) {
                if (isNaN(req.body.search[key])){
                    search.push({[key]: database.sequelize.where(database.sequelize.fn('lower', database.sequelize.col(key)), {[Op.like]: `%${req.body.search[key].toLowerCase()}%`})});
                } else{
                    search.push({[key]: Number(req.body.search[key])});
                }
            }
        }
        Parcels.count({where: search}).then(count => {
            hateosLinks.push({rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl});
            if (Number(pagination.pageNumber) > 1) hateosLinks.push({rel: "has-prev", method: "POST", href: `${req.protocol}://${req.get('host')}/api/parcels/search`});
            if ((Number(pagination.pageNumber) * Number(pagination.pageSize)) < count) hateosLinks.push({rel: "has-next", method: "POST", href: `${req.protocol}://${req.get('host')}/api/parcels/search`});
        });

        return database.sequelize.transaction((t) => {
            return Parcels.findAll({
                offset: (Number(pagination.pageNumber ? pagination.pageNumber : DEFAULT_PAGE_NUMBER) - 1) * Number(pagination.pageSize ? pagination.pageSize : DEFAULT_PAGE_SIZE),
                limit: Number(pagination.pageSize ? pagination.pageSize : DEFAULT_PAGE_SIZE),
                order: order,
                where: search,
                include: [database.categories]
            }, {transaction: t});
        }).then(data => {
            if (data.length > 0 || data !== undefined) {
                req.parcels = data;
                req.hateosLinks = hateosLinks;
                next();
            } else {
                return res.status(400).json({
                    timestamp: new Date().toISOString(),
                    message: strings.PARCEL_NOT_FOUND,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.PARCEL_NOT_FOUND,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    },
    fetchDataFromService: (req, res, next) => {
        const proxy = Users.resilient("USER-SERVICE");
        let users = req.parcels.filter(e => e.sender && e.receiver).map(x => [x.sender, x.receiver]);
        users = [...new Set(users.reduce((acc, val) => [ ...acc, ...val ], []))];

        proxy.post('/users/join/accountId', {data: users}).then(response => {
            if (response.status >= 300 && !'error' in response.data) return new Error(strings.PROXY_ERR);
            response.data.forEach(e => {database.redis.setex(crypto.MD5(`users-${e.accountId}`).toString(), 3600, JSON.stringify(e))});

            const parcels = req.parcels.map(e => {
                const sender = response.data.find(x => x.accountId === e.sender);
                const receiver = response.data.find(x => x.accountId === e.receiver);

                return {...e.dataValues, sender: {senderId: e.sender, name:`${sender.firstName} ${sender.lastName}`, tel: sender.tel, places: sender.places, userName: sender.userName, email: sender.email}, receiver: {receiverId: e.receiver, name:`${receiver.firstName} ${receiver.lastName}`, tel: receiver.tel, places: receiver.places, userName: receiver.userName, email: receiver.email}};
            });

            return res.status(200).json({data: parcels}, req.hateosLinks);
        }).catch(err => {
            req.cacheId = users;
            next();
        });
    },
    fetchDataFromCache: (req, res, next) => {
        database.redis.mget(req.cacheId.map(e => {return crypto.MD5(`users-${e}`).toString()}), (err, data) => {
            if (!data) {
                return res.status(500).json({
                    timestamp: new Date().toISOString(),
                    message: strings.PARCEL_NOT_FOUND,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            } else {
                try{
                    data = JSON.stringify(data.map(e => {return JSON.parse(e)}));
                    const parcels = req.parcels.map(e => {
                        const parsedData = JSON.parse(data);
                        const sender = parsedData.find(x => x.accountId === e.sender);
                        const receiver = parsedData.find(x => x.accountId === e.receiver);

                        return {...e.dataValues, sender: {senderId: e.sender, name:`${sender.firstName} ${sender.lastName}`, tel: sender.tel, places: sender.places, userName: sender.userName, email: sender.email}, receiver: {receiverId: e.receiver, name:`${receiver.firstName} ${receiver.lastName}`, tel: receiver.tel, places: receiver.places, userName: receiver.userName, email: receiver.email}};
                    });

                    return res.status(200).json({data: parcels}, req.hateosLinks);
                } catch(err) {
                    return res.status(500).json({
                        timestamp: new Date().toISOString(),
                        message: strings.PARCEL_NOT_FOUND,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                }
            }
        });
    }
};

exports.join = {
    authorize: (req, res, next) => {
        if (!req.hasRole(['ROLE_SYSTEM'])) {
            return res.status(401).json({
                timestamp: new Date().toISOString(),
                message: strings.AUTH_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    checkBody: (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                message: strings.SERVER_REQUEST_ERR,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        }
        next()
    },
    validate: [
        check('columnName')
            .isAlpha().withMessage(strings.PARCEL_COLUMN_NAME_ALPHA),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    timestamp: new Date().toISOString(),
                    message: strings.SERVER_VALIDATION_ERR,
                    error: true,
                    validations: errors.array(),
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
            next()
        }
    ],
    inDatabase: (req, res, next) => {
        let ids = [];
        if (req.body) {
            for (const element of req.body) {
                ids.push({[req.params.columnName]: {[Op.eq]: Number(element)}});
            }
        }

        return database.sequelize.transaction((t) => {
            return Parcels.findAll({where: {[Op.or]: ids}, include: [database.categories]}, {transaction: t});
        }).then(data => {
            if (data.length > 0 || data !== undefined) {
                req.parcels = data;
                next();
            } else {
                return res.status(400).json({
                    timestamp: new Date().toISOString(),
                    message: strings.CATEGORY_NOT_FOUND,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.CATEGORY_NOT_FOUND,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
        });
    },
    fetchDataFromService: (req, res, next) => {
        const proxy = Users.resilient("USER-SERVICE");
        let users = req.parcels.filter(e => e.sender && e.receiver).map(x => [x.sender, x.receiver]);
        users = [...new Set(users.reduce((acc, val) => [ ...acc, ...val ], []))];

        proxy.post('/users/join/accountId', {data: users}).then(response => {
            if (response.status >= 300 && !'error' in response.data) return new Error(strings.PROXY_ERR);
            response.data.forEach(e => {database.redis.setex(crypto.MD5(`users-${e.accountId}`).toString(), 3600, JSON.stringify(e))});

            const parcels = req.parcels.map(e => {
                const sender = response.data.find(x => x.accountId === e.sender);
                const receiver = response.data.find(x => x.accountId === e.receiver);

                return {...e.dataValues, sender: {senderId: e.sender, name:`${sender.firstName} ${sender.lastName}`, tel: sender.tel, places: sender.places, userName: sender.userName, email: sender.email}, receiver: {receiverId: e.receiver, name:`${receiver.firstName} ${receiver.lastName}`, tel: receiver.tel, places: receiver.places, userName: receiver.userName, email: receiver.email}};
            });

            return res.status(200).json(parcels, req.hateosLinks);
        }).catch(err => {
            req.cacheId = users;
            next();
        });
    },
    fetchDataFromCache: (req, res, next) => {
        database.redis.mget(req.cacheId.map(e => {return crypto.MD5(`users-${e}`).toString()}), (err, data) => {
            if (!data) {
                return res.status(500).json({
                    timestamp: new Date().toISOString(),
                    message: strings.PARCEL_NOT_FOUND,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            } else {
                try{
                    data = JSON.stringify(data.map(e => {return JSON.parse(e)}));
                    const parcels = req.parcels.map(e => {
                        const parsedData = JSON.parse(data);
                        const sender = parsedData.find(x => x.accountId === e.sender);
                        const receiver = parsedData.find(x => x.accountId === e.receiver);

                        return {...e.dataValues, sender: {senderId: e.sender, name:`${sender.firstName} ${sender.lastName}`, tel: sender.tel, places: sender.places, userName: sender.userName, email: sender.email}, receiver: {receiverId: e.receiver, name:`${receiver.firstName} ${receiver.lastName}`, tel: receiver.tel, places: receiver.places, userName: receiver.userName, email: receiver.email}};
                    });

                    return res.status(200).json(parcels, req.hateosLinks);
                } catch(err) {
                    return res.status(500).json({
                        timestamp: new Date().toISOString(),
                        message: strings.PARCEL_NOT_FOUND,
                        error: true,
                        nav: `${req.protocol}://${req.get('host')}`
                    });
                }
            }
        });
    }
};