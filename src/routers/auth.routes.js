const router = require("express").Router();
const {
  login,
  register,
  me,
  addcategory,
  addincome,
  verifyotp,
  resendotpverificationcode,
} = require("../controllers/auth.controller");
const authValidation = require("../middlewares/validations/auth.validation");
const { tokenCheck } = require("../middlewares/auth");

router.post("/login", authValidation.login, login);

router.post("/register", authValidation.register, register);

router.get("/me", tokenCheck, me);

router.post("/addcategory", addcategory);

router.post("/addincome", tokenCheck, addincome);

router.post("/verifyotp", verifyotp);

router.post("/resendotpverificationcode", resendotpverificationcode);

module.exports = router;
