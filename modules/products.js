const sequelize = require("../db/sequelize");
const config = require("../config");

exports.getProductsByShopId = async (req, res) => {
  const shopId = req.params.shopid;

  if (shopId == "undefined" || shopId == null || shopId == "") {
    return res
      .status(400)
      .json({
        success: 0,
        error: global.HTTP_CODE.BAD_REQUEST + ": Shop ID is required",
      })
  }

  try {
    const products = await sequelize.products.findAll({
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
      return res
        .status(404)
        .json({
            success: 0,
            error: global.HTTP_CODE.NOT_FOUND + ": Products not found",
        })
    }

    return res.status(200).json({
        success: 1,
        error: null,
        data: products,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: 0,
        error: error.message,
      })
  }
};

exports.getProductById = async (req, res) => {
  const shopId = req.params.shopid;
  const productId = req.params.id;

  try {
    const product = await sequelize.products.findOne({
      where: {
        id: productId,
        shop_id: shopId,
        deleted: 0,
      },
    });

    if (!product) {
      return res
        .status(404)
        .send(global.HTTP_CODE.NOT_FOUND + ": Product not found");
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

  if (req.shop?.id != req.params.shopid) {
    return res
      .status(403)
      .json({
        success: 0,
        error: global.HTTP_CODE.FORBIDDEN + ": You are not authorized to create product for this shop",
      });
  }

  try {
    const shopId = req.params.shopid;
    const { name, description, price, quantity, weight, size } = req.body;
    let thumbnail;
    let images = [];

    if (req.files?.length == 0) {
      return res.status(400).json({
        success: 0,
        error: "Product thumbnail and images are required!",
      });
    } else if (req.files.length >= 1) {
      req.files.forEach((file) => {
        if (file.fieldname === "thumbnail") {
          thumbnail = file?.publicUrl;
        } else if (file.fieldname === "images") {
          images.push(file?.publicUrl);
        }
      });
    }

    const product = await sequelize.products.create({
      name,
      description,
      price,
      thumbnail,
      images,
      quantity,
      weight,
      shop_id: shopId,
    });

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
      return res
        .status(403)
        .json({
            success: 0,
            error: global.HTTP_CODE.FORBIDDEN + ": You are not authorized to update product for this shop",
            });
    }

    const productId = req.params.id;
    const { name, description, price, quantity, weight } = req.body;

    let thumbnail;
    let images = [];

    if (req.files?.length >= 1) {
      req.files?.forEach((file) => {
        if (file.fieldname === "thumbnail") {
          thumbnail = file?.publicUrl;
        } else if (file.fieldname === "images") {
          images.push(file?.publicUrl);
        }
      });
    }

    //Check if product exists
    const existsPr = await sequelize.products.findOne({
      where: {
        id: productId,
        shop_id: shopId,
        deleted: 0,
      },
    });

    if (!existsPr) {
      return res.status(404).json({
        success: 0,
        error: global.HTTP_CODE.NOT_FOUND + ": Product not found",
      });
    }

    const product = await sequelize.products.update(
      {
        name,
        description,
        price,
        thumbnail,
        images,
        quantity,
        weight,
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
    console.log("error", error);
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
      return res
        .status(403)
        .json({
            success: 0,
            error: global.HTTP_CODE.FORBIDDEN + ": You are not authorized to delete product for this shop",
        });
    }

    const product = await sequelize.products.update(
      {
        deleted: 1,
      },
      {
        where: {
          id: productId,
          shop_id: shopId,
          deleted: 0,
        },
      }
    );

    if (!product) {
      return res
        .status(404)
        .json({
            success: 0,
            error: global.HTTP_CODE.NOT_FOUND + ": Product not found",
        });
    }

    return res
      .status(201)
      .json({
            success: 1,
            error: null,
            data: "Product deleted successfully",
        });

  } catch (error) {
    return res
      .status(500)
      .json({
            success: 0,
            error: error.message,
        });
  }
};
