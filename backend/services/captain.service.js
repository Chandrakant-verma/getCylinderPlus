const captainModel = require("../models/captain.model");

module.exports.createCaptain = async ({
  firstName,
  lastName,
  email,
  address,
  contactNumber,
  password,
  branch
}) => {
  if (!firstName || !lastName || !email || !address || !contactNumber || !password || !branch) {
    throw new Error("All fields are required");
  }
  const captain = captainModel.create({
    name:{firstName: firstName, lastName: lastName},
    email,
    address,
    contactNumber,
    password,
    branch
  });

  return captain;
};
