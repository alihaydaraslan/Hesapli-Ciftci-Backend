const router = require("express").Router();

const {
  addincome,
  incomeGetByPage,
} = require("../controllers/income.controller");
const authValidation = require("../middlewares/validations/auth.validation");
const { tokenCheck, verifyEmail } = require("../middlewares/auth");

router.post("/addincome", tokenCheck, addincome);

router.get("/incomeGetByPage", tokenCheck, incomeGetByPage);

module.exports = router;
