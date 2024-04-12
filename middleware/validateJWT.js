const sequelize = require("../db/sequelize");
const jwt = require("jsonwebtoken");

exports.validateJWT = async (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).send("Token is required");
    }

    try {
        if (!token.startsWith("Bearer ")) {
            return res.status(401).send("Invalid token");
        }
        
        const jwtToken = token.split(" ")[1]

        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).send("Invalid token");
        }


        //Check if token has expired 
        if (decoded.exp < Math.floor(Date.now() / 1000)) {
            return res.status(401).send("Token has expired");
        }


        const user = await sequelize.customers.findOne({
            where: { id: decoded.id, email: decoded.email },
        });


        if (!user) {
            return res.status(404).send("User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}