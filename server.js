const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Question = require('./models/question');

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/polling-app', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create a question
app.post('/questions/create', async (req, res) => {
  try {
    const { title } = req.body;
    const question = new Question({ title });
    const savedQuestion = await question.save();
    res.json(savedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add options to a question
app.post('/questions/:id/options/create', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    const { text } = req.body;
    question.options.push({ text });
    const savedQuestion = await question.save();
    res.json(savedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a vote to an option
app.post('/options/:id/add_vote', async (req, res) => {
  try {
    const question = await Question.findOne({ 'options._id': req.params.id });
    if (!question) {
      return res.status(404).json({ error: 'Option not found' });
    }
    const option = question.options.id(req.params.id);
    option.votes += 1;
    const savedQuestion = await question.save();
    res.json(savedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a question
app.delete('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    await question.remove();
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an option
app.delete('/options/:id/delete', async (req, res) => {
  try {
    const question = await Question.findOne({ 'options._id': req.params.id });
    if (!question) {
      return res.status(404).json({ error: 'Option not found' });
    }
    const option = question.options.id(req.params.id);
    if (option.votes > 0) {
      return res.status(400).json({ error: 'Cannot delete option with votes' });
    }
    option.remove();
    const savedQuestion = await question.save();
    res.json(savedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View a question with its options and votes
app.get('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
