const router = require("express").Router();

const auth = require("./auth.routes");
const income = require("./income.routes");
const expense = require("./expense.routes");

router.use("/users", auth);
router.use("/income", income);
router.use("/expense", expense);

module.exports = router;
