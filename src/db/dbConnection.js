const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("The database connection is successful.");
  })
  .catch((err) => {
    console.log("An error occurred while connecting to the database: " + err);
  });
