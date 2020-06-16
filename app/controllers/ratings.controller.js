const {validationResult, check} = require('express-validator/check');

const strings = require('../../resources/strings');
const database = require("../models");

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
        check('description')
            .matches(/[^\x00-\x7F]|[a-zA-Z0-9]|[$&:;=?@#.()%!-]/).withMessage(strings.RATING_DESCRIPTION_MATCHES),
        check('rating')
            .matches(/^[1-5]$/).withMessage(strings.RATING_RATING_MATCHES),
        check('image')
            .isBase64().withMessage(strings.RATING_IMAGE_BASE),
        check('parcelId')
            .isBase64().withMessage(strings.RATING_PARCEL_ID_INT),

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
            return Ratings.create(req.body, {transaction: t});
        }).then(data => {
            return res.status(201).json(data, [
                {rel: "rating", method: "GET", href: `${req.protocol}://${req.get('host')}/api/ratings/${data.id}`}]);
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.CREATE_RATING_ERR,
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
            .isInt({min: 1}).withMessage(strings.RATING_ID_INT),

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
            return Ratings.destroy({
                where: {id: req.params.id}
            }, {transaction: t});
        }).then(num => {
            if (num === 1) {
                return res.status(200).json({});
            } else {
                return res.status(400).json({
                    timestamp: new Date().toISOString(),
                    message: strings.GET_RATING_ERR,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.DELETE_RATING_ERR,
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
            .isInt({min: 1}).withMessage(strings.RATING_ID_INT),
        check('description')
            .matches(/[^\x00-\x7F]|[a-zA-Z0-9]|[$&:;=?@#.()%!-]/).withMessage(strings.RATING_DESCRIPTION_MATCHES),
        check('rating')
            .matches(/^[1-5]$/).withMessage(strings.RATING_RATING_MATCHES),
        check('image')
            .isBase64().withMessage(strings.RATING_IMAGE_BASE),
        check('parcelId')
            .isBase64().withMessage(strings.RATING_PARCEL_ID_INT),

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
            return Ratings.update(req.body, {
                where: {id: req.params.id}
            }, {transaction: t});
        }).then(num => {
            if (num === 1) {
                return res.status(200).json({});
            } else {
                return res.status(400).json({
                    timestamp: new Date().toISOString(),
                    message: strings.GET_RATING_ERR,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.UPDATE_RATING_ERR,
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
            .isInt({min: 1}).withMessage(strings.RATING_ID_INT),

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
            return Ratings.findByPk(req.params.id,
                {include: [database.parcels], transaction: t});
        }).then(data => {
            if (data) {
                return res.status(200).json(data, [
                    {rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl},
                    {rel: "all-ratings", method: "GET", href: `${req.protocol}://${req.get('host')}/api/ratings/page/${DEFAULT_PAGE_NUMBER}/limit/${DEFAULT_PAGE_SIZE}`}]);
            } else {
                return res.status(400).json({
                    timestamp: new Date().toISOString(),
                    message: strings.GET_RATING_ERR,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.RATING_NOT_FOUND,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
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
            .isInt({min: 1}).withMessage(strings.RATING_PAGE_NUMBER_INT),
        check('pageSize')
            .isInt({min: 1}).withMessage(strings.RATING_PAGE_SIZE_INT),

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
            return Ratings.findAll({
                offset: (Number(req.params.pageNumber) - 1) * Number(req.params.pageSize),
                limit: Number(req.params.pageSize),
                order: [['createdAt', 'ASC']],
                include: [database.parcels]
            }, {transaction: t});
        }).then(data => {
            if (data.length > 0 || data !== undefined) {
                return res.status(206).json({data}, [
                    {rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl},
                    {rel: "next-range", method: "GET", href: `${req.protocol}://${req.get('host')}/api/ratings/page/${1 + Number(req.params.pageNumber)}/limit/${req.params.pageSize}`}]);
            } else {
                return res.status(400).json({
                    timestamp: new Date().toISOString(),
                    message: strings.RATING_NOT_FOUND,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.RATING_NOT_FOUND,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
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
        Ratings.count({where: search}).then(count => {
            hateosLinks.push({rel: "self", method: "GET", href: req.protocol + '://' + req.get('host') + req.originalUrl});
            if (Number(pagination.pageNumber) > 1) hateosLinks.push({rel: "has-prev", method: "POST", href: `${req.protocol}://${req.get('host')}/api/ratings/search`});
            if ((Number(pagination.pageNumber) * Number(pagination.pageSize)) < count) hateosLinks.push({rel: "has-next", method: "POST", href: `${req.protocol}://${req.get('host')}/api/ratings/search`});
        });

        return database.sequelize.transaction((t) => {
            return Ratings.findAll({
                offset: (Number(pagination.pageNumber ? pagination.pageNumber : DEFAULT_PAGE_NUMBER) - 1) * Number(pagination.pageSize ? pagination.pageSize : DEFAULT_PAGE_SIZE),
                limit: Number(pagination.pageSize ? pagination.pageSize : DEFAULT_PAGE_SIZE),
                order: order,
                where: search,
                include: [database.parcels]
            }, {transaction: t});
        }).then(data => {
            if (data.length > 0 || data !== undefined) {
                return res.status(200).json({data}, hateosLinks);
            } else {
                return res.status(400).json({
                    timestamp: new Date().toISOString(),
                    message: strings.RATING_NOT_FOUND,
                    error: true,
                    nav: `${req.protocol}://${req.get('host')}`
                });
            }
        }).catch(err => {
            return res.status(500).json({
                timestamp: new Date().toISOString(),
                message: strings.RATING_NOT_FOUND,
                error: true,
                nav: `${req.protocol}://${req.get('host')}`
            });
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
            .isAlpha().withMessage(strings.RATING_COLUMN_NAME_ALPHA),

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
            return Ratings.findAll({where: {[Op.or]: ids}, include: [database.parcels]}, {transaction: t});
        }).then(data => {
            if (data.length > 0 || data !== undefined) {
                return res.status(200).json(data);
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
    }
};