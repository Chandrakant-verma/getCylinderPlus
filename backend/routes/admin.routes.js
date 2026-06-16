const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const { authAdmin } = require("../middlewares/auth.middleware");

// const registerValidation = [
//   body("firstName").notEmpty().withMessage("firstName is required"),
//   body("lastName").notEmpty().withMessage("lastName is required"),
//   body("email").isEmail().withMessage("Valid email is required"),
//   body("password")
//     .isLength({ min: 3 })
//     .withMessage("Password must be at least 3 characters"),
//   body("address").notEmpty().withMessage("address is required"),
//   body("contactNumber").notEmpty().withMessage("contactNumber is required"),
// ];

const branchValidation = [
  body("branchName").notEmpty().withMessage("branchName is required"),
  body("branchAddress").notEmpty().withMessage("branchAddress is required"),
  body("contactNumber").notEmpty().withMessage("contactNumber is required"),
];

// router.post("/register", registerValidation, adminController.createAdmin);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),

    body("password").notEmpty().withMessage("Password is required"),
  ],
  adminController.loginAdmin,
);

router.get("/profile", authAdmin, adminController.getAdminProfile);
// router.put("/profile", authAdmin, adminController.updateAdminProfile);
// router.delete("/delete", authAdmin, adminController.deleteAdmin);

router.get("/users", authAdmin, adminController.getAllUsers);
router.get("/captains", authAdmin, adminController.getAllCaptains);
router.get("/orders", authAdmin, adminController.getAllOrders);
router.get(
  "/getBusinessInsights",
  authAdmin,
  adminController.getBusinessInsights,
);
router.post("/askAnalytics", authAdmin, adminController.askAnalytics);
router.get("/setPrice", authAdmin, adminController.sePrice);

router.post(
  "/branches",
  authAdmin,
  branchValidation,
  adminController.addBranch,
);

module.exports = router;
