const mongoose = require("mongoose");
const TaskSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: [
    {
      description: { type: String, required: true },
      objectives: [String],
      mainContent: { type: String, required: true },
      questions: {
        text: { type: String, required: true },
        type: {
          type: String,
          enum: ["text", "multiple-choice", "multiple-select"],
          required: true,
        },
        options: [String],
        correctAnswer: String,
        correctAnswers: [String],
        hint: String,
      },
    },
  ],
});

module.exports = TaskSchema;
