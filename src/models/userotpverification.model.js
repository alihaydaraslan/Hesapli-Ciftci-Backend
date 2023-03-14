const mongoose = require("mongoose");

const userotpverificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});

const userotpverification = mongoose.model(
  "UserOTPVerification",
  userotpverificationSchema
);

module.exports = userotpverification;
