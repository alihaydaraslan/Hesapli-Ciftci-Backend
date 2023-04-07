const Expense = require("../models/expense.model");
const Category = require("../models/category.model");
const Company = require("../models/company.model");

const addexpense = async (req, res) => {
  const { title, quantity, comment, date, categoryName } = req.body;

  const userId = req.user._id;

  const company = await Company.findOne({
    $or: [
      {
        ownerId: userId,
      },
      {
        employees: userId,
      },
    ],
  });

  companyId = company._id;

  categoryId = await Category.findOne({ categoryName });

  categoryId = categoryId._id;

  try {
    const newExpense = await Expense.create({
      userId,
      title,
      quantity,
      comment,
      date,
      categoryId,
      companyId,
    });

    return res.status(200).send(newExpense);
  } catch (error) {
    throw new APIError(error, 500);
  }
};

const expenseGetByPage = async(req, res) => {
  const { page } = req.query
  const limit = 10
  const skip = Number(page - 1) * limit
  
  try {
    const expenseGetByPage = await Expense.find({}).limit(limit).skip(skip)

    return res.status(200).send(expenseGetByPage)
  } catch (error) {
    throw new APIError(error,500)
  }
}

module.exports = {
  addexpense,
  expenseGetByPage
};
