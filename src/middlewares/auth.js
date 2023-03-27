const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const APIError = require("../utils/errors");

const createToken = async (user, res) => {
  const payload = {
    sub: user._id,
    name: user.name,
  };

  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    algorithm: "HS512",
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return res.status(201).json({
    success: true,
    token,
    message: "Successful!",
    user: user,
  });
};

const tokenCheck = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) throw new APIError("Invalid session. Please sign in!", 401);

  await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) throw new APIError("Invalid token.", 401);

    const userInfo = await User.findById(decoded.sub).select(
      "_id name lastname email"
    );

    if (!userInfo) throw new APIError("Invalid token.", 401);

    req.user = userInfo;

    next();
  });
};

const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user.isVerified) {
      next();
    } else {
      throw new APIError("Please check your email to verify your account", 401);
    }
  } catch (error) {
    throw new APIError("No user found", 401);
  }
};

module.exports = {
  createToken,
  tokenCheck,
  verifyEmail,
};
