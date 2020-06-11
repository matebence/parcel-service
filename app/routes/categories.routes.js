module.exports = app => {
    const categories = require("../controllers/categories.controller");
    const router = require("express").Router();

    router.post("/", categories.create.authorize, categories.create.checkBody, categories.create.validate, categories.create.inDatabase);

    router.delete("/:id", categories.delete.authorize, categories.delete.validate, categories.delete.inDatabase);

    router.put("/:id", categories.update.authorize, categories.update.checkBody, categories.update.validate, categories.update.inDatabase);

    router.get("/:id", categories.get.authorize, categories.get.validate, categories.get.inDatabase);

    router.get("/page/:pageNumber/limit/:pageSize", categories.getAll.authorize, categories.getAll.validate, categories.getAll.inDatabase);

    router.post("/search", categories.search.authorize, categories.search.checkBody, categories.search.inDatabase);

    app.use('/api/categories', router);
};