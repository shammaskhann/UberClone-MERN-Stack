const userModel = require("../models/user.model");
const { createUser } = require("../services/user.services");
const { validationResult } = require("express-validator");

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
    const hashedPassword = await userModel.hashPassword(password);
    console.info(hashedPassword);
    const newUser = await createUser(fullname, email, hashedPassword);
    const token = newUser.generateAuthToken();
    res
      .status(201)
      .json({ message: "User created successfully", token, user: newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
