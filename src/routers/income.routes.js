const router = require("express").Router();

const { addincome } = require("../controllers/income.controller");
const authValidation = require("../middlewares/validations/auth.validation");
const { tokenCheck, verifyEmail } = require("../middlewares/auth");

router.post("/addincome", tokenCheck, addincome);

module.exports = router;
