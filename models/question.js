// models/question.js
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
  link_to_vote: { type: String }  // New attribute for storing the URL for adding a vote
});

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  options: [optionSchema],
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
