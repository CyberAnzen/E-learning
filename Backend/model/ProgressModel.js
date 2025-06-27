const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Users",
    },
    
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Progress", ProgressSchema);
