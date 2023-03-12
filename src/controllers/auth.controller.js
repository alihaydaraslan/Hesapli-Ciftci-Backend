const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middlewares/auth");

const login = async (req, res) => {
  /*
  const { userEmailPhone, password } = req.body;

  const userInfo = await user.findOne({
    $or: [
      {
        email: userEmailPhone,
      },
      {
        phone: userEmailPhone,
      },
    ],
  });

  const comparePassword = await bcrypt.compare(password, userInfo.password);

  if (!userInfo || !comparePassword)
    throw new APIError("Email, phone number or password is incorrect!", 401);
  */

  let userInfo;

  userInfo = await user.findOne({ email: req.body.email });
  if (!userInfo) userInfo = await user.findOne({ phone: req.body.phone });
  if (!userInfo)
    throw new APIError("Email, phone number or password is incorrect!", 401);

  const validatedUser = await bcrypt.compare(
    req.body.password,
    userInfo.password
  );

  if (!validatedUser)
    throw new APIError("Email, phone number or password is incorrect!", 401);

  createToken(userInfo, res);
};

const register = async (req, res) => {
  const { email, phone } = req.body;

  const emailCheck = await user.findOne({ email });
  const phoneNrCheck = await user.findOne({ phone });

  if (emailCheck || phoneNrCheck) {
    throw new APIError("Mail or phone number is already on use!", 401);
  }

  req.body.password = await bcrypt.hash(req.body.password, 10);

  const userSave = new user(req.body);

  await userSave
    .save()
    .then((data) => {
      return new Response(data, "Registration successfully added!").created(
        res
      );
    })
    .catch((err) => {
      throw new APIError(err, 400);
    });
};

const me = async (req, res) => {
  return new Response(req.user).success(res);
};

module.exports = {
  login,
  register,
  me
};
