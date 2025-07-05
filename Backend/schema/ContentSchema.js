const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  duration: { type: String, required: true },
});
module.exports = ContentSchema;
