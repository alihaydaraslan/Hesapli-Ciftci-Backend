const router = require("express").Router();

const auth = require("./auth.routes");
const income = require("./income.routes");
const expense = require("./expense.routes");
const company = require("./company.routes");

router.use("/users", auth);
router.use("/income", income);
router.use("/expense", expense);
router.use("/company", company);

module.exports = router;
