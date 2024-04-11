const sequelize = require("../db/sequelize");
const config = require("../config");

exports.getProducts = async (req, res) => {
    try {
    const shopId = req.params.shopid;
    const products = await sequelize.products.findAll({
        where: {
        shop_id: shopId,
        deleted: 0
        },
        offset: req.query.offset ? parseInt(req.query.offset) : 0,
        limit: req.query.limit ? parseInt(req.query.limit) : config.Query.max_limit,
    });

    if (!products) {
        return res.status(404).json({ error: "No Products in Shop!" });
    }

     return res.json(products);
    }
    catch (error) {
     return res.status(500).json({ error: error.message });
    }
}

exports.getProductById = async (req, res) => {
    try {
    const shopId = req.params.shopid;
    const productId = req.params.id;
    const product = await sequelize.products.findOne({
        where: {
        id: productId,
        shop_id: shopId,
        deleted: 0
        },
    });

    if (!product) {
        return res.status(404).json({ error: "Product not found!" });
    }

     return res.json(product);
    }
    catch (error) {
     return res.status(500).json({ error: error.message });
    }
}

exports.createProduct = async (req, res) => {
    try {
    const shopId = req.params.shopid;
    const { name, description, price, quantity, banner, images, weight, size } = req.body;

    const product = await sequelize.products.create({
        name,
        description,
        price,
        quantity,
        banner,
        images,
        weight,
        shop_id: shopId,
    });

     return res.json(product);
    }
    catch (error) {
     return res.status(500).json({ error: error.message });
    }
}

exports.updateProduct = async (req, res) => {
    try {
    const shopId = req.params.shopid;
    const productId = req.params.id;
    const { name, description, price, quantity } = req.body;

    const product = await sequelize.products.update(
        {
        name,
        description,
        price,
        quantity,
        category_id,
        banner,
        images,
        weight,
        },
        {
        where: {
            id: productId,
            shop_id: shopId,
            deleted: 0
        },
        }
    );

    res.json(product);
    }
    catch (error) {
    res.status(500).json({ error: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
    const shopId = req.params.shopid;
    const productId = req.params.id;

    const product = await sequelize.products.update({
        deleted: 1,
    },
    {
        where: {
        id: productId,
        shop_id: shopId,
        deleted: 0
        },
    });

    res.status(201).json('Product Deleted! \n' + product);
    }
    catch (error) {
    res.status(500).json({ error: error.message });
    }
}


