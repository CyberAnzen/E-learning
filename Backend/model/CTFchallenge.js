const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const CTFchallenge = new Schema(
  {
    title: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
level: {
  type: String,
  required: true,
  enum: ["easy", "intermediate", "hard", "advanced"]
},
tags:[{type:String}],
creator:{type:String, required:true,}

  },
  {
    timestamps: true,
  }
);

const CTFchallenges = mongoose.model('CTF_challengeS', CTFchallenge);
module.exports = { CTFchallenges };