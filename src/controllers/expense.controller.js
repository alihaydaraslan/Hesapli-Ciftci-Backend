const Expense = require("../models/expense.model");

const addexpense = async (req, res) => {
    const { title, quantity, comment, date, categoryName } = req.body;
  
    const userId = req.user._id;
  
    categoryId = await categorymodel.findOne({ categoryName });
  
    categoryId = categoryId._id;
  
    try {
      const newExpense = await Expense.create({
        userId,
        title,
        quantity,
        comment,
        date,
        categoryId,
      });
  
      return res.status(200).send(newExpense);
    } catch (error) {
      throw new APIError(error, 500);
    }
  };

  module.exports = {
    addexpense
  }