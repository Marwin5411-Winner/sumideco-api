const sequelize = require("../db/sequelize");


// GET Cart By Customer ID
exports.getCartByCustomerId = async (req, res) => {
    const { customerid, shopid } = req.params;
    if (!customer_id) {
        return res.status(400).json({
            success: 0,
            error: "Customer ID is required",
        });
    }

    try {
        const cart = await sequelize.carts.findOne({
            where: {
                customer_id: customerid
            },
        });

        if (!cart) {
            return res.status(404).json({
                success: 0,
                error: "Cart not found",
            });
        }

        res.status(200).json({
            success: 1,
            error: null,
            data: cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: 0,
            error: error.message,
        });
    }
}
