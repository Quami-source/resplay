const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  uid: String,
  password: String,
});

module.exports = model("Users", userSchema);
