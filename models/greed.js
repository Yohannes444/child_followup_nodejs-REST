const mongoose = require('mongoose');

const gradingSystemSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'child',
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  assessment: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  quizzes: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  exams: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

  midExam: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

  assessmentWeight: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  quizWeight: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  examWeight: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

 
  midExam: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
});

module.exports = mongoose.model('Grade', gradingSystemSchema);
