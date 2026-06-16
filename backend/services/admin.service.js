const adminModel = require("../models/admin.model");

module.exports.createAdmin = async ({
  name,
  email,
  address,
  contactNumber,
  password,
  order,
}) => {
  if (!name || !email || !address || !contactNumber || !password ) {
    throw new Error("All fields are required");
  }

  const admin = adminModel.create({
    name,
    email,
    address,
    contactNumber,
    password,
    order,
  });

  return admin;
};