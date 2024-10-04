const { where } = require("sequelize");
const db = require("../models");

exports.getStorefrontById = async (req, res) => {
  const shop_id = req.params.shopid;

  if (!shop_id) {
    return res.status(404).json({
      success: 0,
      error: "404: Shop ID is Required",
    });
  }

  try {
    const storefront = await db.Storefront.findOne({
      where: { shop_id },
    });

    if (!storefront) {
      return res.status(404).json({
        success: 0,
        error: "404: Storefront not found",
      });
    }

    return res.status(200).json({
      success: 1,
      data: storefront,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: "500: An error occurred while fetching shop data",
    });
  }
};

exports.updateStorefrontById = async (req, res) => {
  const shop_id = req.params.shopid;

  if (!shop_id) {
    return res.status(404).json({
      success: 0,
      error: "404: Shop ID is Required",
    });
  }

  const { promotional, theme_settings } = req.body;
  console.log(theme_settings)
  

  if (!promotional && !theme_settings) {
    return res.status(400).json({
      success: 0,
      error: "400: No data provided to update",
    });
  }

  try {
    const storefront = await db.Storefront.findOne({
      where: { shop_id },
    });

    if (!storefront) {
      return res.status(404).json({
        success: 0,
        error: "404: Storefront not found",
      });
    }

    // Update the storefront data
    await storefront.update({
      promotional: promotional ? promotional : storefront.promotional,
      theme_settings: theme_settings ? theme_settings : storefront.theme_settings,
    });

    return res.status(200).json({
      success: 1,
      message: "Storefront updated successfully",
      data: storefront,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      error: "500: An error occurred while updating the storefront data",
    });
  }
};
