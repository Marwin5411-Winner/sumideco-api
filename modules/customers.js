const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../db/sequelize");
const config = require("../config");

exports.getCustomers = async (req, res) => {
  const { shopid } = req.params;
  try {
    const users = await sequelize.customers.findAll({
      attributes: { exclude: ["password"] },
      where: { shop_id: shopid, deleted: 0 },
      limit: req.query.limit ? parseInt(req.query.limit) : config.Query.limit,
      offset: req.query.offset ? parseInt(req.query.offset) : 0,
    });
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.getCustomerById = async (req, res) => {
  const { id, shopid } = req.params;

  if (id == "undefined" || id == null || id == "") {
    return res.status(400).send("User ID is required");
  }

  try {
    const user = await sequelize.customers.findOne({
      attributes: { exclude: ["password"] },
      where: { id, shop_id: shopid, deleted: 0 },
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.createCustomer = async (req, res) => {
  const { shopid } = req.params;
  const { name, email, password, phone } = req.body;
  console.log("req.body", req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await sequelize.customers.create({
      name,
      email,
      password: hashedPassword,
      phone,
      shop_id: shopid,
    });

    res.status(201).send(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.updateCustomer = async (req, res) => {
  const { id, shopid } = req.params;
  const { name, email, password, address, phone } = req.body;

  if (id == "undefined" || id == null || id == "") {
    return res.status(400).send("User ID is required");
  }

  try {
    const user = await sequelize.customers.findOne({
      where: { id, shop_id: shopid, deleted: 0},
    });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({ name, email, password: hashedPassword });

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.deleteCustomer = async (req, res) => {
  const { id, shopid } = req.params;

  if (id == "undefined" || id == null || id == "") {
    return res.status(400).send("User ID is required");
  }

  try {
    const user = await sequelize.customers.update({
        deleted: 1,
        }, {
        where: { id, shop_id: shopid, deleted: 0 },
    })

    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await sequelize.customers.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
