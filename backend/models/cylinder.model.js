const mongoose = require("mongoose");

const cylinderSchema = new mongoose.Schema(
  {
    price : {
      type: String,
      required : true
    }
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Cylinder", cylinderSchema);
