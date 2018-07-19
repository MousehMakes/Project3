var mongoose = require("mongoose");

var dreamSchema = new mongoose.Schema({
  dream: String,
  image: String,
  actionplan: String
});

module.exports = mongoose.model("Dream", dreamSchema);
