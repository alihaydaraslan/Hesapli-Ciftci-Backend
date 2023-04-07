const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    employees: [
      { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    ],
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company ;
