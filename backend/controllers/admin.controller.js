const { validationResult } = require("express-validator");
const adminModel = require("../models/admin.model");
const adminService = require("../services/admin.service");
const captainModel = require("../models/captain.model");
const orderModel = require("../models/order.model");
const branchModel = require("../models/branch.model");
const userModel = require("../models/user.model");
const cylinderModel = require("../models/cylinder.model");

require("dotenv").config();

const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

const loginAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const admin = await adminModel.findOne({ email: email }).select("+password");

  if (!admin) {
  return res.status(404).json({
    message: "No admin found with this email",
  });
}

const isMatch = true;

if (!isMatch) {
  return res.status(401).json({
    message: "Invalid password",
  });
}

  const token = admin.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, admin });
};

const getAdminProfile = async (req, res) => {
  res.status(200).json(req.admin);
};

const updateAdminProfile = async (req, res) => {
  // Logic to update admin profile information
};

const deleteAdmin = async (req, res) => {
  // Logic to delete an admin account
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().populate("branch").select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Failed to retrieve users" });
  }
};

const getAllCaptains = async (req, res) => {
  try {
    const captains = await captainModel
      .find()
      .populate("branch")
      .select("-password");
    return res.status(200).json(captains);
  } catch (error) {
    console.error("Error fetching captains:", error);
    return res.status(500).json({ message: "Failed to retrieve captains" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("branch")
      .populate("user", "-password");

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Failed to retrieve orders" });
  }
};

const addBranch = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { branchName, branchAddress, contactNumber } = req.body;

    const newBranch = await branchModel.create({
      branchName,
      branchAddress,
      contactNumber,
    });

    return res.status(201).json({
      message: "Branch created successfully",
      branch: newBranch,
    });
  } catch (error) {
    console.error("Error creating branch:", error);
    return res.status(500).json({ message: "Failed to create branch" });
  }
};

const getBusinessInsights = async (req, res) => {
  try {
    const monthlyOrders = await orderModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const statusStats = await orderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalOrders = await orderModel.countDocuments();

    const deliveredOrders = await orderModel.countDocuments({
      status: "delivered",
    });

    const cancelledOrders = await orderModel.countDocuments({
      status: "cancelled",
    });

    const pendingOrders = await orderModel.countDocuments({
      status: "pending",
    });

    const totalRevenue = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const prompt = `
You are a professional LPG cylinder delivery business analyst.

Business Metrics:

Total Orders: ${totalOrders}

Delivered Orders: ${deliveredOrders}

Cancelled Orders: ${cancelledOrders}

Pending Orders: ${pendingOrders}

Total Revenue:
₹${totalRevenue[0]?.revenue || 0}

Monthly Performance:

${JSON.stringify(monthlyOrders)}

Order Status Breakdown:

${JSON.stringify(statusStats)}

Analyze:

1. Overall business health
2. Order growth trend
3. Revenue trend
4. Cancellation risk
5. Expected next month order volume
6. Expected next month revenue
7. Key recommendations
8. Potential risks

Keep answer under 10 lines.
`;

    const response = await client.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 700,
    });

    res.status(200).json({
      insights: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate business insights",
    });
  }
};

const askAnalytics = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const totalOrders = await orderModel.countDocuments();

    const deliveredOrders = await orderModel.countDocuments({
      status: "delivered",
    });

    const cancelledOrders = await orderModel.countDocuments({
      status: "cancelled",
    });

    const pendingOrders = await orderModel.countDocuments({
      status: "pending",
    });

    const branchStats = await orderModel.aggregate([
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchInfo",
        },
      },
      {
        $unwind: "$branchInfo",
      },
      {
        $group: {
          _id: "$branchInfo.branchName",
          totalOrders: {
            $sum: 1,
          },
          revenue: {
            $sum: "$totalAmount",
          },
          delivered: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "delivered"],
                },
                1,
                0,
              ],
            },
          },
          cancelled: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "cancelled"],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const monthlyOrders = await orderModel.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const prompt = `
You are an LPG delivery business analyst.

Business Data:

Total Orders:
${totalOrders}

Delivered:
${deliveredOrders}

Cancelled:
${cancelledOrders}

Pending:
${pendingOrders}

Branch Statistics:

${JSON.stringify(branchStats)}

Monthly Orders:

${JSON.stringify(monthlyOrders)}

Question:

${question}

Answer ONLY using the data provided.
Give business insights in 10 lines.
`;

    const response = await client.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 700,
    });

    res.status(200).json({
      answer: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate analytics answer",
    });
  }
};

const sePrice = async (req, res, next) => {
  try {
    const { price } = req.query;

    if (!price) {
      return res.status(400).json({
        message: "Price is required",
      });
    }

    const cylinder = await cylinderModel.findOneAndUpdate(
      {},
      { price },
      { new: true }
    );

    console.log("Cylinder updated:", cylinder);

    res.status(200).json(cylinder);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  deleteAdmin,
  getAllUsers,
  getAllCaptains,
  getAllOrders,
  addBranch,
  getBusinessInsights,
  askAnalytics,
  sePrice,
};
