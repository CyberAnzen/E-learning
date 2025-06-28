const mongoose = require("mongoose");
const { Schema } = mongoose;
const QuestionSchema = require("./QuestionSchema");
const TaskSchema = new Schema({
  title: { type: String, required: true },
  content: {
    description: String,
    objectives: [String],
    mainContent: String,
    questions: [QuestionSchema],
  },
});

module.exports = TaskSchema;
