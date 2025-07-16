const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} = require("../controller/user.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/register",
  [
    body("fullname").notEmpty().withMessage("Fullname is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("fullname")
      .isLength({ min: 3 })
      .withMessage("Fullname must be at least 3 characters long"),
    body("fullname")
      .isLength({ max: 50 })
      .withMessage("Fullname must be less than 50 characters long"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("password")
      .isLength({ max: 50 })
      .withMessage("Password must be less than 50 characters long"),
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("password")
      .isLength({ max: 50 })
      .withMessage("Password must be less than 50 characters long"),
  ],
  loginUser
);

router.get("/profile", authMiddleware.authenticate, getProfile);

router.get("/logout", authMiddleware.authenticate, logoutUser);

module.exports = router;
