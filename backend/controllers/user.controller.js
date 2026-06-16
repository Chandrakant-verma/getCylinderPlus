const { validationResult } = require("express-validator");
const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");
const branchModel = require("../models/branch.model");
const mapController = require("./map.controller");
const mapService = require("../services/maps.service");
const cylinderModel = require("../models/cylinder.model");
const crypto = require("crypto");
const { sendMessageToSocketId } = require("../socket");

const razorpay = require("../controllers/payment.controller");

const captainModel = require("../models/captain.model");

const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, address, contactNumber } =
    req.body;

  const isUserAlready = await userModel.findOne({ email });

  if (isUserAlready) {
    return res.status(400).json({ message: "User already exist" });
  }

  let nearestBranch = null;
  let minDistance = Infinity;

  const branches = await branchModel.find();

  for (const branch of branches) {
    const distanceData = await mapService.getDistanceTime(
      address,
      branch.branchAddress,
    );

    const distance = distanceData.distance.value; // meters

    if (distance < minDistance) {
      minDistance = distance;
      nearestBranch = branch;
    }
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userModel.create({
    name: {
      firstName,
      lastName,
    },
    email,
    password: hashedPassword,
    address,
    contactNumber,
    branch: nearestBranch._id,
  });

  const token = user.generateAuthToken();

  res.status(201).json({
    message: "Registration successful!",
    token,
    user,
  });
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, user });
};

const getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

const updateUserProfile = async (req, res, next) => {
  // Logic to update user profile information
};

const logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  // await blackListTokenModel.create({ token });

  res.status(200).json({ message: "Logged out" });
};

const deleteUser = async (req, res, next) => {
  // Logic to delete a user account
};

const makeOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { totalAmount, shippingAddress, branch } = req.body;

  if (totalAmount == null || shippingAddress == null || branch == null) {
    return res
      .status(400)
      .json({ message: "totalAmount , shippingAddress, branch are required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const order = await orderModel.create({
    user: req.user?._id,
    totalAmount,
    shippingAddress,
    paymentStatus: "pending",
    deliveryStatus: "pending",
    deliveryOTP: otp,
    branch,
  });

  res.status(201).json({ message: "Order placed successfully", order });
};

const getUserOrders = async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user._id });
  res.status(200).json({ orders });
};

const cancelOrder = async (req, res, next) => {
  const orderId = req.params.orderId;

  const order = await orderModel.findOne({ _id: orderId, user: req.user._id });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.deliveryStatus = "cancelled";
  await order.save();

  res.status(200).json({ message: "Order cancelled successfully", order });
};

const getOtp = async (req, res, next) => {
  const order = await orderModel.findOne({
    user: req.user._id,
    deliveryStatus: "pending",
  });

  if(!order){
    res.status(404).json({message: "order not found at user controller in get otp mtlb is user se related koi order nahi hai and req.user ko print kr rh hu : "})
  }

  res.status(200).json(order.deliveryOTP);
};

const getPrice = async (req, res, next) => {
  const cylinder = await cylinderModel.findOne();

  if (!cylinder) {
    return res.status(404).json({
      message: "Cylinder not found",
    });
  }

  res.status(200).json({
    price: cylinder.price,
  });
};

const getCurrentOrder = async (req, res) => {
  const order = await orderModel.findOne({
    user: req.user._id,
    deliveryStatus: {
      $in: ["pending", "reached"],
    },
  });

  res.status(200).json({
    success: true,
    order,
  });
};

const createPaymentOrder = async (req, res) => {
  try {
    const order = await orderModel.findOne({
      user: req.user._id,
      deliveryStatus: "reached",
      paymentStatus: "pending",
    });

    if (!order) {
      return res.status(404).json({
        message: "No pending payment found",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100,
      currency: "INR",
    });

    order.razorpayOrderId = razorpayOrder.id;

    await order.save();

    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Payment order creation failed",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment",
      });
    }

    const order = await orderModel.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.paymentStatus = "paid";

    order.deliveryStatus = "delivered";

    order.razorpayPaymentId = razorpay_payment_id;

    order.paidAt = new Date();

    await order.save();

    const captains = await captainModel.find({
      branch: order.branch,
    });

    captains.forEach((captain) => {
      if (captain.socketId) {
        sendMessageToSocketId(captain.socketId, {
          event: "payment_completed",
          data: {
            orderId: order._id,
          },
        });
      }
    });

    const user = await userModel.findById(order.user);

    if (user?.socketId) {
      sendMessageToSocketId(user.socketId, {
        event: "payment_completed",
        data: {
          orderId: order._id,
          userId: order.user,
        },
      });
    }

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Verification failed",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  deleteUser,
  makeOrder,
  getUserOrders,
  cancelOrder,
  getOtp,
  getPrice,
  getCurrentOrder,
  createPaymentOrder,
  verifyPayment,
};
