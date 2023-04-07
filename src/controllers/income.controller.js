const Income = require("../models/income.model");
const Category = require("../models/category.model");
const Company = require("../models/company.model");
const APIError = require("../utils/errors");

const addincome = async (req, res) => {
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
    const newIncome = await Income.create({
      userId,
      title,
      quantity,
      comment,
      date,
      categoryId,
      companyId,
    });

    return res.status(200).send(newIncome);
  } catch (error) {
    throw new APIError(error, 500);
  }
};

const incomeGetByPage = async(req, res) => {
  const { page } = req.query
  const limit = 10
  const skip = Number(page - 1) * limit
  
  try {
    const incomeGetByPage = await Income.find({}).limit(limit).skip(skip)

    return res.status(200).send(incomeGetByPage)
  } catch (error) {
    throw new APIError(error,500)
  }
}

module.exports = {
  addincome,
  incomeGetByPage
};
