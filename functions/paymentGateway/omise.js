const { where } = require("sequelize");
const db = require("../../models");
const OMISE_SECRET_KEY = process.env.OMISE_SECRET_KEY;

// Create a recipient
exports.createRecipient = async (shopId, bankAccount) => {
  try {
    if (!shopId) {
      throw new Error("shopId is required to create a recipient.");
    }

    // Check if bankAccount is provided
    if (!bankAccount) {
      throw new Error(
        "bankAccount details are required to create a recipient."
      );
    }

    // Create the body as form data for the fetch request
    const formData = new URLSearchParams();
    formData.append("name", bankAccount.name);
    formData.append("email", bankAccount.email);
    formData.append(
      "description",
      `Additional information about ${bankAccount.name}.`
    );
    formData.append("type", bankAccount.type || "individual");
    formData.append("tax_id", bankAccount.tax_id || "");
    formData.append("bank_account[brand]", bankAccount.bank_account.brand);
    formData.append("bank_account[number]", bankAccount.bank_account.number);
    formData.append("bank_account[name]", bankAccount.bank_account.name);

    // Make the API request using fetch
    const response = await fetch("https://api.omise.co/recipients", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${OMISE_SECRET_KEY}:`).toString(
          "base64"
        )}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error creating recipient: ${response.statusText}`);
    }

    const recipient = await response.json();

    // Extract recipient ID
    const recipientId = recipient.id;

    // Store the recipient ID in the shop secrets
    await storeRecipientIdInShopSecrets(shopId, recipientId);

    return recipient;
  } catch (error) {
    console.error("Error creating recipient:", error);
    throw error;
  }
};

exports.getRecipientById = async (shopId) => {
  try {
    // Validate input
    if (!shopId) {
      throw new Error("shopId is required to get the recipient.");
    }

    // Fetch the shop secrets to get the recipient ID
    const shopSecrets = await db.ShopSecret.findOne({
      where: { shop_id: shopId },
    });

    if (!shopSecrets || !shopSecrets.omise_recipient_id) {
      throw new Error("Recipient ID not found for this shop.");
    }

    const recipientId = shopSecrets.omise_recipient_id;

    // Set your Omise secret key
    const OMISE_SECRET_KEY = process.env.OMISE_SECRET_KEY;

    // Make the API request to retrieve the recipient
    const response = await fetch(
      `https://api.omise.co/recipients/${recipientId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(`${OMISE_SECRET_KEY}:`).toString(
            "base64"
          )}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error retrieving recipient: ${response.statusText}`);
    }

    const recipientData = await response.json();

    return recipientData; // Return the recipient details
  } catch (e) {
    console.error("Error retrieving recipient:", e);
    throw e;
  }
};

// Example function to store recipient ID in shop secrets (actual implementation)
async function storeRecipientIdInShopSecrets(shopId, recipientId) {
    try {
      if (!shopId) {
        throw new Error("shopId is required to create a recipient.");
      }
  
      if (!recipientId) {
        throw new Error("recipientId is required to update in the database.");
      }
  
      // Fetch the ShopSecret for the shop
      const shopSecret = await db.ShopSecret.findOne({
        where: { shop_id: shopId },
      });
  
      if (!shopSecret) {
        throw new Error(`ShopSecret not found for shopId: ${shopId}`);
      }
  
      // Update the omise_recipient_id field
      shopSecret.omise_recipient_id = recipientId;
  
      // Save the updated shop secret
      await shopSecret.save();
  
      console.log(`Storing recipient ID ${recipientId} for shop ${shopId}`);
    } catch (error) {
      console.error('Error storing recipient ID:', error);
      throw new Error(error.message);
    }
  }
  

exports.createPayoutToMerchant = async (shopId, amount) => {
  try {
    // Validate input
    if (!shopId) {
      throw new Error("shopId is required to create a payout.");
    }

    if (!amount || amount <= 0) {
      throw new Error("amount is required and must be greater than 0.");
    }

    // Fetch the shop and its related ShopSecret to get the recipient ID
    const shop = await db.Shop.findOne({
      where: { id: shopId },
      include: [db.ShopSecret],
    });

    if (!shop || !shop.ShopSecret || !shop.ShopSecret.omise_recipient_id) {
      throw new Error("Recipient ID not found for this shop.");
    }

    const recipientId = shop.ShopSecret.omise_recipient_id;

    // Prepare the form data for the request
    const formData = new URLSearchParams();
    formData.append("amount", amount);
    formData.append("recipient", recipientId);

    // Make the API request to create the payout
    const response = await fetch("https://api.omise.co/transfers", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${OMISE_SECRET_KEY}:`).toString(
          "base64"
        )}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error creating payout: ${response.statusText}`);
    }

    const payoutData = await response.json();

    // Store the payout record in the database
    const payoutRecord = await db.Payout.create({
      shop_id: shopId,
      transfer_id: payoutData.id, // This is the transfer/payout ID from Omise
      amount: payoutData.amount, // The amount that was transferred
      currency: payoutData.currency || "THB", // Default to 'THB' if not provided
      failure_code: payoutData.failure_code || null, // Capture any failure codes if present
      total_fee: payoutData.total_fee || 0, // You may need to adjust based on your setup
    });

    return payoutRecord;
  } catch (e) {
    console.error("Error creating payout:", e);
    throw e;
  }
};
