const mongoose = require("mongoose");

const companyInviteReqSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      trim: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      trim: true,
      enum: ["pending", "cancelled", "accepted"],
    },
  },
  {
    timestamps: true,
  }
);

const CompanyInviteReq = mongoose.model(
  "CompanyInviteReq",
  companyInviteReqSchema
);

module.exports = { CompanyInviteReq };
