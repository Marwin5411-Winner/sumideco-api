const sequelize = require("../db/sequelize");


// GET Cart By Customer ID
exports.getCartByCustomerId = async (req, res) => {
    const { customerid, shopid } = req.params;
    if (!customer_id) {
        return res.status(400).send("Customer Id is required");
    }

    try {
        const cart = await sequelize.carts.findOne({
            where: {
                customer_id: customerid
            },
        });

        if (!cart) {
            return res.status(404).send("Cart not found");
        }

        res.status(200).send(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
