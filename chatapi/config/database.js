const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
const mongoose = require("mongoose");
// console.log(process.env.MONGO_URL);

const { MONGO_URL } = process.env;
exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
      console.log(MONGO_URL);
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};
