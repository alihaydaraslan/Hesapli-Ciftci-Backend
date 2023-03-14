const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    categoryName: {
      type: String,
    },
  },
  {
    collection: "categories",
  }
);

const category = mongoose.model("categories", categorySchema);

module.exports = category;
