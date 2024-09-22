const db = require("../models");
const product = require("../models/product");

// Check Product Quanity
exports.checkProductQuantity = async (product_id, quantity) => {
    try {
        const product = await db.Product.findOne({
            where: {
                id: product_id,
                deleted: 0
            },
        });

        if (product.quantity < quantity) {
            return false;
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

exports.checkProductByIdwithShopId = async (shopId, productId) => {
    try {
        const product = await db.Product.findOne({
            where: {
                id: productId,
                shop_id: shopId,
                deleted: 0
            },
        });

        if (!product) {
            return false;
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// GET Products Details By Product ID with Shop ID
exports.getProductById = async (shopId, productId) => {
    try {
        const product = await db.Product.findOne({
            attributes: { exclude: ["deleted", "createdAt", "updatedAt"] },
            where: {
                id: productId,
                shop_id: shopId,
                deleted: 0
            },
        });

        if (!product) {
            return false;
        }

        return product;
    } catch (error) {
        console.error(error);
        return false;
    }
}


exports.increasementProductsTotalToShopDetails = async (shopId) => {
   
  try {
    // Step 1: Increment the totalProducts field by 1 for the given shopId
    const updated = await db.ShopDetail.increment('total_products', {
      by: 1, // Increment by 1
      where: { shop_id: shopId }, // Target the shop with the provided shopId
    });

    if (updated[0][1] === 0) {
      console.error(`Shop with id ${shopId} not found or no update made.`);
      return false;
    }


    console.log(`Incremented total products for shop ${shopId}`);
    return true;
  } catch (error) {
    console.error(`Error incrementing total products for shop ${shopId}:`, error.message);
    throw error;
  }

}

exports.decreasementProductsTotalToShopDetails = async (shopId) => {
    if (!shopId) {
      console.error("Shop ID Required");
      return false;
    }
  
    try {
      // Step 1: Get the current totalProducts for validation
      const shopDetail = await db.ShopDetail.findOne({
        where: { shop_id: shopId },
        attributes: ['total_products'],
      });
  
      if (!shopDetail) {
        console.error(`Shop with id ${shopId} not found.`);
        return false;
      }
  
      // Ensure totalProducts doesn't go below zero
      if (shopDetail.totalProducts <= 0) {
        console.error("Total products cannot be less than zero.");
        return false;
      }
  
      // Step 2: Decrement the totalProducts field by 1
      const updated = await db.ShopDetail.increment('total_products', {
        by: -1, // Decrement by 1
        where: { shop_id: shopId },
      });
  
      if (updated[0][1] === 0) {
        console.error(`Shop with id ${shopId} not found or no update made.`);
        return false;
      }
  
      console.log(`Decremented total products for shop ${shopId}`);
      return true;
    } catch (error) {
      console.error(`Error decrementing total products for shop ${shopId}:`, error.message);
      throw error;
    }
  };