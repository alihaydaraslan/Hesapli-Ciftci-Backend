const router = require("express").Router();

const {
  login,
  register,
  me,
  addcategory,
  addincome,
  addexpense,
  verifyemail,
  listAll,
  find,
} = require("../controllers/auth.controller");
const authValidation = require("../middlewares/validations/auth.validation");
const { tokenCheck, verifyEmail } = require("../middlewares/auth");

router.post("/login", verifyEmail, authValidation.login, login);

router.post("/register", authValidation.register, register);

router.get("/me", tokenCheck, me);

router.post("/addcategory", addcategory);

router.post("/addincome", tokenCheck, addincome);

router.post("/addexpense", tokenCheck, addexpense);

router.get("/verify-email", verifyemail);

router.get("/listall", tokenCheck, listAll);

router.get("/find", tokenCheck, find);

// router.post("/verifyotp", verifyotp);

// router.post("/resendotpverificationcode", resendotpverificationcode);

module.exports = router;
