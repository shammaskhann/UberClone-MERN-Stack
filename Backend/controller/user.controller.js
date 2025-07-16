const userModel = require("../models/user.model");
const { createUser } = require("../services/user.services");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");
module.exports.registerUser = async (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await createUser(fullname, email, password);
    const token = newUser.generateAuthToken();
    res
      .status(201)
      .json({ message: "User created successfully", token, user: newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    console.warn("User not found");
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    console.info("Password is not valid");
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();
  res.status(200).json({ message: "Login successful", token, user });
};

module.exports.logoutUser = async (req, res) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  await blackListTokenModel.create({ token });

  res.status(200).json({ message: "Logged out" });
};
module.exports.getProfile = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ user });
};
