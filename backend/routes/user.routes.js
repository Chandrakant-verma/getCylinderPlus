const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const userController = require("../controllers/user.controller");
const { authUser } = require("../middlewares/auth.middleware");

const registerValidation = [
  body("firstName").notEmpty().withMessage("firstName is required"),
  body("lastName").notEmpty().withMessage("lastName is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters"),
  body("address").notEmpty().withMessage("address is required"),
  body("contactNumber").notEmpty().withMessage("contactNumber is required"),
];

router.post("/register", registerValidation, userController.registerUser);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),

    body("password").notEmpty().withMessage("Password is required"),
  ],
  userController.loginUser,
);

router.get("/profile", authUser, userController.getUserProfile);
router.post("/logout", authUser, userController.logoutUser);

router.post(
  "/orders",
  authUser,
  [
    body("totalAmount").isNumeric(),
    body("shippingAddress").notEmpty(),
    body("branch").notEmpty(),
  ],
  userController.makeOrder,
);

router.get("/price", authUser, userController.getPrice);

router.get("/orders/cancel/:orderId", authUser, userController.cancelOrder);
router.get("/orders", authUser, userController.getUserOrders);

router.delete("/delete", authUser, userController.deleteUser);

router.get("/get-otp", authUser, userController.getOtp);

router.post("/create-order", authUser, userController.createPaymentOrder);

router.post("/verify", authUser, userController.verifyPayment);

module.exports = router;
