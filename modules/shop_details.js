const db = require("../models");

// INPUT :
// PARAMS : shopid

exports.getShopDetailsByShopId = async (req, res) => {
  const { shopid } = req.params;

  if (!id) {
    return res.status(404).json({
      success: 0,
      error: global.HTTP_CODE.NOT_FOUND + ": Shop ID is Required",
    });
  }

  try {
    //SOON: Add redis support for less latency

    const shop = await db.Shop.findOne({
      where: {
        id: shopid,
      },
      
    });

    if (!shop) {
      return res.status(404).json({
        success: 0,
        error: global.HTTP_CODE.NOT_FOUND + ": Shop Not Found",
      });
    }




  } catch (e) {


  }
};
