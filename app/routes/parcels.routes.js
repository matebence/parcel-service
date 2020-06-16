module.exports = app => {
    const parcels = require("../controllers/parcels.controller");
    const router = require("express").Router();

    router.post("/", parcels.create.authorize, parcels.create.checkBody, parcels.create.validate, parcels.create.inDatabase);

    router.delete("/:id", parcels.delete.authorize, parcels.delete.validate, parcels.delete.inDatabase);

    router.put("/:id", parcels.update.authorize, parcels.update.checkBody, parcels.update.validate, parcels.update.inDatabase);

    router.get("/:id", parcels.get.authorize, parcels.get.validate, parcels.get.inDatabase, parcels.get.fetchDataFromService, parcels.get.fetchDataFromCache);

    router.get("/page/:pageNumber/limit/:pageSize", parcels.getAll.authorize, parcels.getAll.validate, parcels.getAll.inDatabase, parcels.getAll.fetchDataFromService, parcels.getAll.fetchDataFromCache);

    router.post("/search", parcels.search.authorize, parcels.search.checkBody, parcels.search.inDatabase, parcels.search.fetchDataFromService, parcels.search.fetchDataFromCache);

    router.post("/join/:columnName", parcels.join.authorize, parcels.join.checkBody, parcels.join.validate, parcels.join.inDatabase, parcels.join.fetchDataFromService, parcels.join.fetchDataFromCache);

    app.use('/api/parcels', router);
};