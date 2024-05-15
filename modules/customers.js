const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../db/sequelize");
const config = require("../config");
const { where } = require("sequelize");

exports.getCustomersByShopId = async (req, res) => {
  const { shopid } = req.params;

  if (shopid == "undefined" || shopid == null || shopid == "") {
    return res.status(400).json({
      success: 0,
      error: global.HTTP_CODE.BAD_REQUEST + ": Shop ID is required",
    });
  }

  if (req.shop?.id !== shopid) {
    return res.status(403).json({
      success: 0,
      error:
        global.HTTP_CODE.FORBIDDEN +
        ": You are not authorized to view this shop's customers",
    });
  }

  try {
    const users = await sequelize.customers.findAll({
      attributes: { exclude: ["password"] },
      where: { shop_id: shopid, deleted: 0 },
      limit: req.query.limit ? parseInt(req.query.limit) : config.Query.limit,
      offset: req.query.offset ? parseInt(req.query.offset) : 0,
    });

    return res.status(200).json({
      success: 1,
      error: null,
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

exports.getCustomerById = async (req, res) => {
  const { id, shopid } = req.params;

  if (id == "undefined" || id == null || id == "") {
    return res.status(400).json({
      success: 0,
      error: global.HTTP_CODE.BAD_REQUEST + ": User ID is required",
    });
  }

  //Check if user is authorized to view this shop's customer
  if (req.shop?.id !== shopid || req.user?.id !== id) {
    return res.status(403).json({
      success: 0,
      error:
        global.HTTP_CODE.FORBIDDEN +
        ": You are not authorized to view this shop's customer",
    });
  }

  try {
    const user = await sequelize.customers.findOne({
      attributes: { exclude: ["password"] },
      where: { id, shop_id: shopid, deleted: 0 },
    });
    if (!user) {
      return res.status(404).json({
        success: 0,
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: 1,
      error: null,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

exports.updateCustomer = async (req, res) => {
  const { id, shopid } = req.params;
  const { name, email, password, address, phone } = req.body;

  if (id == "undefined" || id == null || id == "") {
    return res.status(400).json({
      success: 0,
      error: global.HTTP_CODE.BAD_REQUEST + ": User ID is required",
    });
  }

  //Check if user is authorized to update this shop's customer
  if (req.shop?.id !== shopid || req.user?.id !== id) {
    return res.status(403).json({
      success: 0,
      error:
        global.HTTP_CODE.FORBIDDEN +
        ": You are not authorized to update this shop's customer",
    });
  }

  try {
    const user = await sequelize.customers.findOne({
      where: { id, shop_id: shopid, deleted: 0 },
    });
    if (!user) {
      return res.status(404).json({
        success: 0,
        error: global.HTTP_CODE.NOT_FOUND + ": User not found",
      });
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : user.password;

    await user.update({
      name: name || user.name,
      email: email || user.email,
      password: hashedPassword || user.password,
    });

    return res.status(200).json({
      success: 1,
      error: null,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  const { id, shopid } = req.params;

  if (id == "undefined" || id == null || id == "") {
    return res.status(400).json({
      success: 0,
      error: global.HTTP_CODE.BAD_REQUEST + ": User ID is required",
    });
  }

  //Check if user is authorized to delete this shop's customer
  if (req.shop?.id !== shopid || req.user?.id !== id) {
    return res.status(403).json({
      success: 0,
      error:
        global.HTTP_CODE.FORBIDDEN +
        ": You are not authorized to delete this shop's customer",
    });
  }

  try {
    const user = await sequelize.customers.update(
      {
        deleted: 1,
      },
      {
        where: { id, shop_id: shopid, deleted: 0 },
      }
    );

    //Check if user not exists
    if (!user) {
      return res.status(404).json({
        success: 0,
        error: global.HTTP_CODE.NOT_FOUND + ": User not found",
      });
    }

    return res.status(200).json({
      success: 1,
      error: null,
      data: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

exports.getCartByCustomerId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json({
      success: 0,
      error: global.HTTP_CODE.NOT_FOUND + ": Customer ID is Required",
    });
  }

  try {
    const customer = await sequelize.customers.findOne({
      where: {
        id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: 0,
        error: global.HTTP_CODE.NOT_FOUND + ": Customer Not Found",
      });
    }

    return res.status(200).json({
      success: 1,
      error: null,
      data: customer.cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: error.message,
    });
  }
};

/*
  Request Body JSON
  products : [
      {
        product_id : {id}
        amount: {id} || 1
        price: {price}
      }
    ]
*/

exports.addItemstoCartByCustomerId = async (req, res) => {
  const { id } = req.params;
  const { products } = req.body;

  if (!id) {
    return res.status(404).json({
      success: 0,
      error: global.HTTP_CODE.NOT_FOUND + ": Customer ID is Required",
    });
  }

  if (!products) {
    return res.status(404).json({
      success: 0,
      error: global.HTTP_CODE.NOT_FOUND + ": Products List is Required",
    });
  }

  try {
    let customer = await sequelize.customers.findOne({
      where: {
        id,
      },
    });

    

    if (!customer || !customer.cart) {
      return res.status(404).json({
        success: 0,
        error: "Customer Not Found or Missing Cart",
      });
    }

    var cart = customer.cart;

    //Before Add Cart Total

    //After Cart total

    for (const product of products) {
      // TODO : 15 MAY 2024
      //Make it check for duplicate product
      //Increase Amount instead of add more product to a list
      const existingProductIndex = cart.products.findIndex(
        (cartProduct) => cartProduct.id === product.product_id
      );

      if (existingProductIndex !== -1) {
        // Duplicate found! Update amount and total for existing product
        cart.products[existingProductIndex].amount += product.amount;
        cart.products[existingProductIndex].total =
          cart.products[existingProductIndex].amount *
          cart.products[existingProductIndex].price;
      } else {
        // No duplicate found, add product to cart normally
        const productData = await sequelize.products.findOne({
          where: {
            id: product.product_id,
          },
        });

        if (productData) {
          let data = {
            id: productData.id,
            product_name: productData.name,
            price: productData.price,
            amount: product.amount,
            total: product.amount * product.price,
          };
          cart.products.push(data);
        }
      }
    }

    // Calculate total in a separate loop
    cart.payment.total = cart.products.reduce(
      (accumulator, product) => accumulator + product.total,
      0
    );

    const updateCustomer = await sequelize.customers.update(
      {
        cart,
      },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({
      success: 1,
      error: null,
      data: cart,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: 0,
      error: e.message,
    });
  }
};

// Data Type
// cart : object
exports.updateCartByCustomerId = async (req, res) => {
  const { id } = req.params;
  const { cart } = req.body;

  if (!id) {
    return res.status(404).json({
      success: 0,
      error: global.HTTP_CODE.NOT_FOUND + ": Customer ID is Required",
    });
  }

  try {
    const customer = await sequelize.customers.findOne({
      where: {
        id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: 0,
        error: global.HTTP_CODE.NOT_FOUND + ": Customer Not Found",
      });
    }

    const updatedCart = await sequelize.customers.update(
      {
        cart,
      },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({
      success: 1,
      error: null,
      data: updatedCart,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: 0,
      error: e.message,
    });
  }
};

exports.clearCartByCustomerId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json({
      success: 0,
      error: global.HTTP_CODE.NOT_FOUND + ": Customer ID is Required",
    });
  }

  try {
    const customer = await sequelize.customers.findOne({
      where: {
        id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: 0,
        error: global.HTTP_CODE.NOT_FOUND + ": Customer Not Found",
      });
    }

    const clearedCart = await sequelize.customers.update(
      {
        cart: {
          products: [],
          payment: {
            total: 0.0,
            tax: 0.0,
            currency: null,
          },
        },
      },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({
      success: 1,
      error: null,
      data: clearedCart,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: 0,
      error: e.message,
    });
  }
};
