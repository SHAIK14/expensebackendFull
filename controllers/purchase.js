const Razorpay = require("razorpay");
const Order = require("../models/orders");
const userController = require("./user");

const purchasepremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: "rzp_test_3iiTrQs6HNxDQF", // Replace with your Razorpay key_id
      key_secret: "UooBDauQASkhNPJTqLasgl7S", // Replace with your Razorpay key_secret
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
    req.user.ispremium = true;
    await req.user.save();
    order.status = "paid";
    order.paymentid = payment_id;
    //  Object.assign(order, {status:'paid' , payment_id:razorpay_payment_id}); // Merge the updatedData into the order object
    await order.save(); // Save the updated order to the database
    res.json({ message: "Payment successful", isPremium: req.user.ispremium });

    //2
    // const promise1 = order.update({
    //   paymentid: payment_id,
    //   status: "SUCCESSFUL",
    // });
    // const promise2 = req.user.update({ ispremiumuser: true });

    // Promise.all([promise1, promise2])
    // .then(() => {
    //   return res.status(202).json({
    //     sucess: true,
    //     message: "Transaction Successful",
    //     token: userController.generateAccessToken(userId, undefined, true),
    //   });
    // })
    // .catch((error) => {
    //   throw new Error(error);
    // });
  } catch (error) {
    console.log("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

module.exports = {
  purchasepremium,
  updateTransactionStatus,
};

// const Razorpay = require("razorpay");
// const Order = require("../models/orders");
// const userController = require("./user");

// const purchasepremium = async (req, res) => {
//   try {
//     var rzp = new Razorpay({
//       key_id: "rzp_test_SubuPd5v83ZVQM", // Replace with your Razorpay key_id
//       key_secret: "9cScimJUHNcsYX2JtXiAlngQ", // Replace with your Razorpay key_secret
//     });

//     const amount = 2500;

//     rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
//       if (err) {
//         throw new Error(JSON.stringify(err));
//       }
//       req.user
//         .createOrder({ orderid: order.id, status: "PENDING" })
//         .then(() => {
//           return res.status(201).json({ order, key_id: rzp.key_id });
//         })
//         .catch((err) => {
//           throw new Error(err);
//         });
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(403).json({ message: "Something went wrong", error: err });
//   }
// };
// const updateTransactionStatus = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { payment_id, order_id } = req.body;
//     const order = await Order.findOne({ where: { orderid: order_id } }); //2
//     const promise1 = order.update({
//       paymentid: payment_id,
//       status: "SUCCESSFUL",
//     });
//     const promise2 = req.user.update({ ispremiumuser: true });

//     Promise.all([promise1, promise2])
//       .then(() => {
//         return res.status(202).json({
//           sucess: true,
//           message: "Transaction Successful",
//           token: userController.generateAccessToken(userId, undefined, true),
//         });
//       })
//       .catch((error) => {
//         throw new Error(error);
//       });
//   } catch (err) {
//     console.log(err);
//     res.status(403).json({ errpr: err, message: "Sometghing went wrong" });
//   }
// };

// module.exports = {
//   purchasepremium,
//   updateTransactionStatus,
// };
