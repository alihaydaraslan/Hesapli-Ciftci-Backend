const Income = require("../models/income.model");


const addincome = async (req, res) => {
    const { title, quantity, comment, date, categoryId } = req.body;
  
    const userId = req.user._id;
  
    try {
      const newIncome = await Income.create({
        userId,
        title,
        quantity,
        comment,
        date,
        categoryId,
      });
  
      return res.status(200).send(newIncome);
    } catch (error) {
      console.log(error);
      throw new APIError(error, 500);
    }
  };

  module.exports = {
    addincome
  }