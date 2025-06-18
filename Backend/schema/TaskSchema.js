// schema/TaskSchema.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  text: { type: String, required: true },
  type: {
    type: String,
    enum: ["text", "multiple-choice", "multiple-select"],
    required: true,
  },
  options: {
    type: [String],
    default: undefined, // so empty array isn’t stored if undefined
  },
  // Single‐answer field, required unless it's a multiple-select question
  correctAnswer: {
    type: String,
    validate: {
      validator: function (v) {
        // if not multiple-select, correctAnswer must be non-empty
        if (this.type !== "multiple-select") {
          return typeof v === "string" && v.length > 0;
        }
        return true; // skip validation when multiple-select
      },
      message: (props) =>
        `correctAnswer is required for question type '${props.instance.type}'`,
    },
    required: function () {
      return this.type !== "multiple-select";
    },
  },
  // Multi‐answer field, required only for multiple-select questions
  correctAnswers: {
    type: [String],
    validate: {
      validator: function (arr) {
        // only validate when type is multiple-select
        if (this.type === "multiple-select") {
          return Array.isArray(arr) && arr.length > 0;
        }
        return true;
      },
      message: "correctAnswers array is required for multiple-select questions",
    },
    required: function () {
      return this.type === "multiple-select";
    },
  },
  explanation: { type: String },
  hint: { type: String, default: "No Hint Available for this question" },
});

const TaskSchema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  content: {
    description: String,
    objectives: [String],
    mainContent: String,
    questions: [QuestionSchema],
  },
});

module.exports = TaskSchema;
