module.exports = app => {
    const ratings = require("../controllers/ratings.controller");
    const router = require("express").Router();

    router.post("/", ratings.create.authorize, ratings.create.checkBody, ratings.create.validate, ratings.create.inDatabase);

    router.delete("/:id", ratings.delete.authorize, ratings.delete.validate, ratings.delete.inDatabase);

    router.put("/:id", ratings.update.authorize, ratings.update.checkBody, ratings.update.validate, ratings.update.inDatabase);

    router.get("/:id", ratings.get.authorize, ratings.get.validate, ratings.get.inDatabase);

    router.get("/page/:pageNumber/limit/:pageSize", ratings.getAll.authorize, ratings.getAll.validate, ratings.getAll.inDatabase);

    router.post("/search", ratings.search.authorize, ratings.search.checkBody, ratings.search.inDatabase);

    router.post("/join/:columnName", ratings.join.authorize, ratings.join.checkBody, ratings.join.validate, ratings.join.inDatabase);

    app.use('/api/ratings', router);
};