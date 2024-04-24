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

  if (!name || !email || !password || !phone) {
    return res.status(400).send("All fields are required to register a user");
  }
  
  try {

    //Check if email already exists
    const user = await sequelize.customers.findOne({
      where: { email, shop_id: shopid, deleted: 0 },
    });

    if (user) {
      return res.status(400).send("Email already exists");
    }

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

    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
   

    await user.update({ name: name || user.name, email: email || user.email , password: hashedPassword || user.password });

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


    //Check if user not exists
    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send("User: " + user +" \n deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.loginCustomer = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    let user = await sequelize.customers.findOne({
      where: { email, deleted: 0 },
    });
    if (!user) {
      return res.status(401).send("User not found or Email is incorrect");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid Credentials");
    }
    // Generate token 
    //Expires in 12 hours
    const token = jwt.sign({ id: user.id, email: user.email, shop_id: user.shop_id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 }, process.env.JWT_SECRET);

    user.password = undefined;
    res.status(200).send({  user, token });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
