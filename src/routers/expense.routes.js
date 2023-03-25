const router = require("express").Router();

const { addexpense } = require("../controllers/auth.controller");
const authValidation = require("../middlewares/validations/auth.validation");
const { tokenCheck, verifyEmail } = require("../middlewares/auth");

router.post("/addexpense", tokenCheck, addexpense);

module.exports = router;
