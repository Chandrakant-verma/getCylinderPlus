const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const captainController = require("../controllers/captain.controller");
const { authCaptain } = require("../middlewares/auth.middleware");

const registerValidation = [
  body("firstName").notEmpty().withMessage("firstName is required"),
  body("lastName").notEmpty().withMessage("lastName is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("address").notEmpty().withMessage("address is required"),
  body("contactNumber").notEmpty().withMessage("contactNumber is required"),
  body("branch").notEmpty().withMessage("branch is required"),
];

router.post("/register", registerValidation, captainController.createCaptain);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email"),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  captainController.loginCaptain,
);

router.get("/profile", authCaptain, captainController.getCaptainProfile);

router.post("/logout", authCaptain, captainController.logoutCaptain);

router.get(
  "/assigned-orders",
  authCaptain,
  captainController.getAssignedOrders,
);

router.post("/verifyOtp",authCaptain, captainController.verifyOtp);

router.get('/get-branches',captainController.getBranches);

module.exports = router;