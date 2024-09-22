const db = require("../models");
const config = require("../config");
const productFunction = require("../functions/products");

exports.getProductsByShopId = async (req, res) => {
  const shopId = req.params.shopid;

  if (!shopId) {
    return res.status(400).json({
      success: 0,
      error: "400: Shop ID is required",
    });
  }

  try {
    const products = await db.Product.findAll({
      where: {
        shop_id: shopId,
        deleted: 0,
      },
      offset: req.query.offset ? parseInt(req.query.offset) : 0,
      limit: req.query.limit
        ? parseInt(req.query.limit)
        : config.Query.max_limit,
    });

    if (!products) {
      return res.status(404).json({
        success: 0,
        error: "404: Products not found",
      });
    }

    return res.status(200).json({
      success: 1,
      error: null,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  const shopId = req.params.shopid;
  const productId = req.params.id;

  try {
    const product = await db.Product.findOne({
      where: {
        id: productId,
        shop_id: shopId,
        deleted: 0,
      },
    });

    if (!product) {
      return res.status(404).send("404: Product not found");
    }

    return res.status(200).json({
      success: 1,
      error: null,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      success: 0,
      error: "Product data is required!",
    });
  }
  console.log(req.body);

  if (req.shop?.id !== req.params.shopid) {
    return res.status(403).json({
      success: 0,
      error: "403: You are not authorized to create a product for this shop",
    });
  }

  try {
    const shopId = req.params.shopid;
    const {
      name,
      description,
      price,
      quantity,
      content,
      weight,
      size,
      includedTax,
      productType,
    } = req.body;

    let thumbnail;
    let images = [];

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: 0,
        error: "Product thumbnail or images are required!",
      });
    } else {
      req.files.forEach((file) => {
        if (file.fieldname === "thumbnail") {
          thumbnail = file.publicUrl;
        } else if (file.fieldname === "images") {
          images.push(file.publicUrl);
        }
      });
    }

    const product = await db.Product.create({
      name,
      description,
      price,
      thumbnail,
      images,
      content,
      quantity,
      weight,
      size,
      includedTax,
      productType,
      shop_id: shopId,
    });

    await productFunction.increasementProductsTotalToShopDetails(shopId);

    return res.status(200).json({
      success: 1,
      error: null,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const shopId = req.params.shopid;

    if (req.shop?.id !== shopId) {
      return res.status(403).json({
        success: 0,
        error: "403: You are not authorized to update a product for this shop",
      });
    }

    const productId = req.params.id;
    const {
      name,
      description,
      price,
      quantity,
      weight,
      content,
      size,
      status,
      includedTax,
      productType,
    } = req.body;

    let thumbnail;
    let images = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.fieldname === "thumbnail") {
          thumbnail = file.publicUrl;
        } else if (file.fieldname === "images") {
          images.push(file.publicUrl);
        }
      });
    }

    // Check if product exists
    const existsPr = await db.Product.findOne({
      where: {
        id: productId,
        shop_id: shopId,
        deleted: 0,
      },
    });

    if (!existsPr) {
      return res.status(404).json({
        success: 0,
        error: "404: Product not found",
      });
    }

    const product = await db.Product.update(
      {
        name,
        description,
        price,
        thumbnail,
        images,
        quantity,
        status,
        weight,
        content,
        size,
        includedTax,
        productType,
      },
      {
        where: {
          id: productId,
          shop_id: shopId,
          deleted: 0,
        },
      }
    );

    return res.status(200).json({
      success: 1,
      error: null,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const shopId = req.params.shopid;
    const productId = req.params.id;

    if (req.shop?.id !== shopId) {
      return res.status(403).json({
        success: 0,
        error: "403: You are not authorized to delete a product for this shop",
      });
    }

    const product = await db.Product.destroy({
      where: {
        id: productId,
        shop_id: shopId,
        deleted: 0,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: 0,
        error: "404: Product not found",
      });
    }

    await productFunction.decreasementProductsTotalToShopDetails(shopId);

    return res.status(201).json({
      success: 1,
      error: null,
      data: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};
