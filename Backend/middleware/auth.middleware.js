const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blacklistToken.model");
module.exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1] || req.cookies.token;

  // check if token is provided
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const isBlackListed = await blackListTokenModel.findOne({ token });
  if (isBlackListed) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // check if token is expired
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // check if user exists
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
