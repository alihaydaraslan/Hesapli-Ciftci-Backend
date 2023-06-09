const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middlewares/auth");
const categorymodel = require("../models/category.model");
const Company = require("../models/company.model");
const Income = require("../models/income.model");
const Expense = require("../models/expense.model");
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
  let userInfo;

  userInfo = await User.findOne({ email: req.body.email });
  if (!userInfo) throw new APIError("Email or password is incorrect!", 401);

  const validatedUser = await bcrypt.compare(
    req.body.password,
    userInfo.password
  );

  if (!validatedUser)
    throw new APIError("Email or password is incorrect!", 401);

  createToken(userInfo, res);
};

const register = async (req, res) => {
  try {
    let { name, lastname, email, password } = req.body;

    name = name.trim();
    lastname = lastname.trim();
    email = email.trim();
    password = password.trim();

    const emailCheck = await User.findOne({ email });

    if (emailCheck) {
      throw new APIError("Mail is already on use!", 401);
    }

    const user = new User({
      name,
      lastname,
      email,
      password,
      emailToken: crypto.randomBytes(64).toString("hex"),
    });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    await user.save();

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: "Verify your email",
      html: `<h2> ${user.name} ${user.lastname}, thanks for registering on our site! </h2>
             <h4> Please verify your email address to continue.. </h4>
             <a href="http://${req.headers.host}/users/verify-email?token=${user.emailToken}"> Verify your email address </a>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw new Error(error);
      } else {
        throw new APIError("Verification email sent to your account", 400);
      }
    });

    res.json({
      status: "PENDING",
      message: "Verification otp email sent",
      data: {
        userId: user._id,
        email: user.email,
      },
    });

    // bcrypt.hash(password, 10).then(async (hashedPassword) => {
    //   const user = new User({
    //     name,
    //     lastname,
    //     email,
    //     password: hashedPassword,
    //     emailToken: crypto.randomBytes(64).toString("hex"),
    //   });

    //   userSave
    //     .save()
    //     .then((result) => {
    //       sendOTPVerificationEmail(result, res);
    //     })
    //     .catch((err) => {
    //       throw new APIError(err, 400);
    //     });
    // });
  } catch (error) {
    throw new APIError(error, 400);
  }
};

const verifyemail = async (req, res) => {
  try {
    const token = req.query.token;
    const user = await User.findOne({ emailToken: token });

    if (user) {
      user.emailToken = null;
      user.isVerified = true;
      await user.save();
    } else {
      throw new Error("Email is not verified", 400);
    }
  } catch (error) {
    throw new APIError(error, 400);
  }
};

// const sendOTPVerificationEmail = async (user, res) => {
//   try {
//     const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

//     const mailOptions = {
//       from: process.env.AUTH_EMAIL,
//       to: user.email,
//       subject: "Emailinizi do�rulay�n",
//       html: `<p> Email adresinizi do�rulamak i�in ${otp} kodunu kullan�n. </p>
//       <p> Bu kod <b>1 saat i�inde</b> ge�erlili�ini yitirir </p>`,
//     };

//     const hashedOTP = await bcrypt.hash(otp, 10);

//     const newOTPVerification = await new UserOTPVerification({
//       userId: user._id,
//       otp: hashedOTP,
//       createdAt: Date.now(),
//       expiresAt: Date.now() + 3600000,
//     });

//     await newOTPVerification.save();
//     transporter.sendMail(mailOptions);

//     res.json({
//       status: "PENDING",
//       message: "Verification otp email sent",
//       data: {
//         userId: user._id,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     status: "FAILED";
//     message: error.message;
//   }
// };

// const verifyotp = async (req, res) => {
//   try {
//     let { userId, otp } = req.body;
//     if (!userId || !otp) {
//       throw Error("Empty otp details");
//     } else {
//       let UserOTPVerificationRecords = await UserOTPVerification.find({
//         userId,
//       });

//       if (UserOTPVerificationRecords.length <= 0) {
//         throw new Error(
//           "Account record doesn't exist or has been verified already. Please register or login"
//         );
//       } else {
//         const { expiresAt } = UserOTPVerificationRecords[0];
//         const hashedOTP = UserOTPVerificationRecords[0].otp;

//         if (expiresAt < Date.now()) {
//           await UserOTPVerification.deleteMany({ userId });
//           throw new Error("Code has expired. Please request again");
//         } else {
//           const validOTP = await bcrypt.compare(otp, hashedOTP);

//           if (!validOTP) {
//             throw new Error("Invalid code. Check your inbox");
//           } else {
//             await User.updateOne({ _id: userId }, { isVerified: true });
//             await UserOTPVerification.deleteMany({ userId });

//             res.json({
//               status: "Verified",
//               message: `User email verified successfully`,
//             });
//           }
//         }
//       }
//     }
//   } catch (error) {
//     res.json({
//       status: "Failed",
//       message: error.message,
//     });
//   }
// };

// const resendotpverificationcode = async (req, res) => {
//   try {
//     let { userId, email } = req.body;

//     if (!userId || !email) {
//       throw new Error("Empty user details are not allowed");
//     } else {
//       await UserOTPVerification.deleteMany({ userId });
//       sendOTPVerificationEmail({ _id: userId, email }, res);
//     }
//   } catch (error) {
//     res.json({
//       status: "Failed",
//       message: error.message,
//     });
//   }
// };

const me = async (req, res) => {
  if (!req.user.primalCompany) {
    const company = await Company.findOne({
      ownerId: req.user._id,
    });
    if (!company) {
      const createdCompany = new Company({
        ownerId: req.user._id,
        title: `${req.user.name}'s company`,
      });
      await createdCompany.save();
      await User.findByIdAndUpdate(req.user._id, {
        $set: { primalCompany: createdCompany._id },
      });
    }
  }
  return new Response(req.user).success(res);
};

const addcategory = async (req, res) => {
  const newcategory = new categorymodel(req.body);
  try {
    await newcategory.save();
    res.status(200).json({
      message: "Kategori ba�ar�yla eklendi!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Kategori eklenemedi!",
    });
  }
};

const addcompany = async (req, res) => {
  try {
    const { title } = req.body;

    const ownerId = req.user._id;

    const newcompany = new Company({
      ownerId,
      title,
    });

    await newcompany.save();
    return res.status(201).send(newcompany);
  } catch (error) {
    res.status(500).json({
      message: "Error!",
    });
    console.log(error);
  }
};

const listAll = async (req, res) => {
  const { categoryName } = req.body;

  const userId = req.user._id;

  categoryId = await categorymodel.findOne({ categoryName });

  categoryId = categoryId._id;

  categoriesFromIncome = await Income.find({ userId, categoryId });
  categoriesFromExpense = await Expense.find({ userId, categoryId });

  return new Response(categoriesFromIncome, categoriesFromExpense).success(res);
};

const find = async (req, res) => {
  const { key } = req.body;

  const userId = req.user._id;

  let resultIncomeQuantity;
  let resultExpenseQuantity;

  if (!isNaN(parseInt(key))) {
    resultIncomeQuantity = await Income.find({
      userId,
      quantity: Number(key),
    });
    resultExpenseQuantity = await Expense.find({
      userId,
      quantity: Number(key),
    });

    return new Response([
      ...resultIncomeQuantity,
      ...resultExpenseQuantity,
    ]).success(res);
  }

  let resultIncome = await Income.find({
    userId,
    $or: [
      {
        title: { $regex: key },
      },
      {
        comment: { $regex: key },
      },
      {
        date: { $regex: key },
      },
    ],
  });

  let resultExpense = await Expense.find({
    userId,
    $or: [
      {
        title: { $regex: key },
      },
      {
        comment: { $regex: key },
      },
      {
        date: { $regex: key },
      },
    ],
  });

  let categories = await categorymodel.find({ categoryName: { $regex: key } });
  categoriesIdArray = [];
  categories.forEach((x) => {
    categoriesIdArray.push(x._id);
  });

  let resultCatIdIncome;
  let resultCatIdExpense;

  if (categoriesIdArray.length > 0) {
    resultCatIdIncome = await Income.find({
      userId,
      categoryId: { $in: categoriesIdArray },
    });

    resultCatIdExpense = await Expense.find({
      userId,
      categoryId: { $in: categoriesIdArray },
    });
  }

  return new Response([
    ...resultCatIdIncome,
    ...resultCatIdExpense,
    ...resultIncome,
    ...resultExpense,
  ]).success(res);
};

const updatePushToken = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { expoPushToken: req.body.expoPushToken } },
    { new: true }
  );
  return new Response(user).success(res);
};

module.exports = {
  login,
  register,
  me,
  addcategory,
  verifyemail,
  listAll,
  find,
  updatePushToken,
  addcompany,
};
