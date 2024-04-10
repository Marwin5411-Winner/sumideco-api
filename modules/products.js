const sequelize = require("../db/sequelize");

exports.getProducts = async (req, res) => {
    try {
    const shopId = req.params.shopid;
    const products = await sequelize.products.findAll({
        where: {
        shop_id: shopId,
        },
    });
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
        },
    });
     return res.json(product);
    }
    catch (error) {
     return res.status(500).json({ error: error.message });
    }
}

exports.createProduct = async (req, res) => {
    try {
    const shopId = req.params.shopid;
    const { name, description, price, quantity } = req.body;

    const product = await sequelize.products.create({
        name,
        description,
        price,
        quantity,
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
        },
        {
        where: {
            id: productId,
            shop_id: shopId,
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

    const product = await sequelize.products.destroy({
        where: {
        id: productId,
        shop_id: shopId,
        },
    });

    res.json(product);
    }
    catch (error) {
    res.status(500).json({ error: error.message });
    }
}
