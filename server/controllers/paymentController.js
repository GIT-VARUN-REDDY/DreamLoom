const Razorpay  = require("razorpay");
const crypto    = require("crypto");
const User      = require("../models/User");

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const FULL_PRICE     = 500; // ₹5.00
const DISCOUNT_PRICE =  1000; // ₹10.00 (for first 30 users)

const createOrder = async (req, res) => {
  try {
    const user          = req.user;
    const applyDiscount = user.isFirstThirty && !user.discountUsed;
    const amount        = applyDiscount ? DISCOUNT_PRICE : FULL_PRICE;

    const order = await razorpay.orders.create({
      amount, currency:"INR", receipt:`dl_${Date.now()}`,
    });

    res.json({ success:true, order, amount, applyDiscount, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("createOrder:", err);
    res.status(500).json({ success:false, message:"Failed to create order" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    if (hmac.digest("hex") !== razorpay_signature)
      return res.status(400).json({ success:false, message:"Payment verification failed" });

    const user = req.user;
    if (user.isFirstThirty && !user.discountUsed) {
      user.discountUsed = true;
      await user.save();
    }

    const order = await razorpay.orders.fetch(razorpay_order_id);
    res.json({ success:true, paymentId:razorpay_payment_id, orderId:razorpay_order_id, amount:order.amount });
  } catch (err) {
    console.error("verifyPayment:", err);
    res.status(500).json({ success:false, message:"Payment verification error" });
  }
};

module.exports = { createOrder, verifyPayment };