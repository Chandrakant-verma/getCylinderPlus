const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
    trim: true,
  },
  branchAddress: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch;
