const { validationResult } = require("express-validator");
const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const orderModel = require("../models/order.model");
const branchModel = require("../models/branch.model");
// const blackListTokenModel = require("../models/blacklistToken.model");

const createCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    email,
    password,
    address,
    contactNumber,
    branch,
  } = req.body;

  const isCaptainAlreadyExist = await captainModel.findOne({ email });

  if (isCaptainAlreadyExist) {
    return res.status(400).json({ message: "Captain already exist" });
  }

  const hashedPassword = await captainModel.hashPassword(password);

  const captain = await captainService.createCaptain({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    address,
    contactNumber,
    branch,
  });

  const token = captain.generateAuthToken();

  res.status(201).json({ token, captain });
};

const getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

const updateCaptainProfile = async (req, res, next) => {
  // Logic to update captain profile information
};

const deleteCaptain = async (req, res, next) => {
  // Logic to delete a captain account
};

const getAssignedOrders = async (req, res, next) => {
  try {
    if (!req.captain || !req.captain.branch) {
      return res.status(400).json({ message: "Captain branch not available" });
    }

    const orders = await orderModel.find({
      branch: req.captain.branch,
      $or: [
        {
          deliveryStatus: "pending",
        },
        {
          deliveryStatus: "reached",
          paymentStatus: "pending",
        },
      ],
    });

    res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
};

const logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  // await blackListTokenModel.create({ token });

  res.clearCookie("token");

  res.status(200).json({ message: "Logout successfully" });
};

const loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select("+password");

  if (!captain) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await captain.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = captain.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, captain });
};

const verifyOtp = async (req, res, next) => {
  try {
    const { orderId, otp } = req.body;

    console.log(typeof otp);

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.deliveryOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // const response = await orderModel.findByIdAndUpdate(
    //   orderId,
    //   { status: "delivered" }
    // );

    order.deliveryStatus = "reached";
    //order.deliveryOTP = null;
    await order.save();

    // if (!response) {
    //   return res.status(404).json({
    //     message: "Order not found",
    //   });
    // }

    res.status(200).json({
      success: true,
      paymentRequired: true,
      orderId: order._id,
      amount: order.totalAmount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getBranches = async (req, res, next) => {
  const branches = await branchModel.find();

  res.status(200).json({ branches });
};

module.exports = {
  createCaptain,
  getCaptainProfile,
  updateCaptainProfile,
  deleteCaptain,
  getAssignedOrders,
  loginCaptain,
  logoutCaptain,
  verifyOtp,
  getBranches,
};
