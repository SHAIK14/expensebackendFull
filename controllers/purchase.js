const Razorpay = require("razorpay");
const Order = require("../models/orders");
const userController = require("./user");

const purchasepremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: "rzp_test_3iiTrQs6HNxDQF",
      key_secret: "UooBDauQASkhNPJTqLasgl7S",
    });

    const amount = 2500;
    const currency = "INR";

    const order = await rzp.orders.create({ amount, currency });
    await req.user.createOrder({ orderid: order.id, status: order.status });
    return res
      .status(201)
      .json({ order_id: order.id, key_id: rzp.key_id, amount, currency });
  } catch (error) {
    console.log("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    console.log("Request Headers:", req.headers);
    console.log("Request Body:", req.body);

    console.log("in update trasction function backend", req.body);
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    if (!order_id) {
      console.log("Order ID is missing in the request.");
      return res.status(400).json({ error: "Order ID is missing" });
    }

    const order = await Order.findOne({ where: { orderid: order_id, userId } });
    if (!order) {
      console.log("Order not found for the user.");
      return;
    }
    req.user.isPremium = true;
    await req.user.save();
    order.status = "paid";
    order.paymentid = payment_id;
    //  Object.assign(order, {status:'paid' , payment_id:razorpay_payment_id}); // Merge the updatedData into the order object
    await order.save();
    console.log("Payload before token generation:", {
      userId,
      name: req.user.name,
      isPremium,
    });
    // Save the updated order to the database
    res.status(202).json({
      message: "Payment successful",
      token: userController.generateAccessToken(userId, req.user.name, true),
    }); //isPremium: req.user.ispremium
  } catch (error) {
    console.log("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

module.exports = {
  purchasepremium,
  updateTransactionStatus,
};
