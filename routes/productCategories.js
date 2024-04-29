const express = require("express");
const router = express.Router();
const productCategories = require("../modules/ProductCategories");

router.get("/:shopid", (req, res, next) => {
    productCategories.getCategoriesByShopId(req, res);
});

router.get("/:shopid/:id", (req, res, next) => {
    productCategories.getCategoryById(req, res);
});

router.post("/:shopid", (req, res, next) => {
    productCategories.createCategory(req, res);
});

router.put("/:shopid/:id", (req, res, next) => {
    productCategories.updateCategory(req, res);
});

router.delete("/:shopid/:id", (req, res, next) => {
    productCategories.deleteCategory(req, res);
});

module.exports = router;
