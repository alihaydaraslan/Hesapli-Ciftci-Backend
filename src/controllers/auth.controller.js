const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middlewares/auth");
const categorymodel = require("../models/category.model");
const income = require("../models/income.model");
const UserOTPVerification = require("../models/userotpverification.model");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for messages");
    console.log(success);
  }
});

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

  userInfo = await User.findOne({ email: req.body.email });
  if (!userInfo) userInfo = await User.findOne({ phone: req.body.phone });
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

// const register = async (req, res) => {
//   const { email, phone } = req.body;

//   const emailCheck = await user.findOne({ email });
//   const phoneNrCheck = await user.findOne({ phone });

//   if (emailCheck || phoneNrCheck) {
//     throw new APIError("Mail or phone number is already on use!", 401);
//   }

//   req.body.password = await bcrypt.hash(req.body.password, 10);

//   const userSave = new user(req.body);

//   await userSave
//     .save()
//     .then((data) => {
//       return new Response(data, "Registration successfully added!").created(
//         res
//       );
//     })
//     .catch((err) => {
//       throw new APIError(err, 400);
//     });
// };

const register = async (req, res) => {
  let { name, lastname, email, password } = req.body;

  name = name.trim();
  lastname = lastname.trim();
  email = email.trim();
  password = password.trim();

  const emailCheck = await User.findOne({ email });

  if (emailCheck) {
    throw new APIError("Mail is already on use!", 401);
  }

  bcrypt.hash(password, 10).then((hashedPassword) => {
    const userSave = new User({
      name,
      lastname,
      email,
      password: hashedPassword,
    });

    userSave
      .save()
      .then((result) => {
        sendOTPVerificationEmail(result, res);
      })
      .catch((err) => {
        throw new APIError(err, 400);
      });
  });
};

const sendOTPVerificationEmail = async (user, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: "Emailinizi doðrulayýn",
      html: `<p> Email adresinizi doðrulamak için ${otp} kodunu kullanýn. </p>
      <p> Bu kod <b>1 saat içinde</b> geçerliliðini yitirir </p>`,
    };

    const hashedOTP = await bcrypt.hash(otp, 10);

    const newOTPVerification = await new UserOTPVerification({
      userId: user._id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await newOTPVerification.save();
    transporter.sendMail(mailOptions);

    res.json({
      status: "PENDING",
      message: "Verification otp email sent",
      data: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    status: "FAILED";
    message: error.message;
  }
};

const verifyotp = async (req, res) => {
  try {
    let { userId, otp } = req.body;
    if (!userId || !otp) {
      throw Error("Empty otp details");
    } else {
      let UserOTPVerificationRecords = await UserOTPVerification.find({
        userId,
      });

      if (UserOTPVerificationRecords.length <= 0) {
        throw new Error(
          "Account record doesn't exist or has been verified already. Please register or login"
        );
      } else {
        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;

        if (expiresAt < Date.now()) {
          await UserOTPVerification.deleteMany({ userId });
          throw new Error("Code has expired. Please request again");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);

          if (!validOTP) {
            throw new Error("Invalid code. Check your inbox");
          } else {
            await User.updateOne({ _id: userId }, { isVerified: true });
            await UserOTPVerification.deleteMany({ userId });

            res.json({
              status: "Verified",
              message: `User email verified successfully`,
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
};

const resendotpverificationcode = async (req, res) => {
  try {
    let { userId, email } = req.body;

    if (!userId || !email) {
      throw new Error("Empty user details are not allowed");
    } else {
      await UserOTPVerification.deleteMany({ userId });
      sendOTPVerificationEmail({ _id: userId, email }, res);
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
};

const me = async (req, res) => {
  return new Response(req.user).success(res);
};

const addcategory = async (req, res) => {
  const newcategory = new categorymodel(req.body);
  try {
    await newcategory.save();
    res.status(200).json({
      message: "Kategori baþarýyla eklendi!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Kategori eklenemedi!",
    });
  }
};

const addincome = async (req, res) => {
  const { title, quantity, comment, date, categoryName } = req.body;

  const userId = req.user._id;

  categoryId = await categorymodel.findOne({ categoryName });

  categoryId = categoryId._id;

  try {
    const newIncome = await income.create({
      userId,
      title,
      quantity,
      comment,
      date,
      categoryId,
    });

    return res.status(200).send(newIncome);
  } catch (error) {
    throw new APIError(error, 500);
  }
};

module.exports = {
  login,
  register,
  me,
  addcategory,
  addincome,
  verifyotp,
  resendotpverificationcode,
};
