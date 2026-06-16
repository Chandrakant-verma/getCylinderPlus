const userModel = require("../models/user.model");

module.exports.createUser = async ({
  name,
  email,
  address,
  contactNumber,
  password,
  branch,
  order,
}) => {
  if (!name || !email || !address || !contactNumber || !password || !branch) {
    throw new Error("All required fields are required");
  }
  const user = userModel.create({
    name,
    email,
    address,
    contactNumber,
    password,
    branch,
    order,
  });

  return user;
};
