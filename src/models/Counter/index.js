const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  task: { type: Number, default: 0 },
});

module.exports = mongoose.model("counter", counterSchema);
