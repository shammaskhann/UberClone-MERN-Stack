const userModel = require("../models/user.model");

module.exports.createUser = async (fullname, email, password) => {
  const user = await userModel.findOne({ email });
  if (user) {
    throw new Error("User already exists");
  }
  const hashedPassword = await userModel.hashPassword(password);
  const newUser = new userModel({ fullname, email, password: hashedPassword });
  await newUser.save();
  return newUser;
};
