const mongoose = require('mongoose');
const gradingSystemSchema = new mongoose.Schema({
  student:[{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'child',
      required: true
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    assessment: {
      type: String,
      required: true,
      min: 0,
      max: 30
    },
    quiz: {
      type: String,
      required: true,
      min: 0,
      max: 5
    },
    midExam: {
      type: String,
      required: true,
      min: 0,
      max: 15
    },
    finalExam: {
      type: String,
      required: true,
      min: 0,
      max: 50
    }    
  }],
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});


module.exports = mongoose.model('Grade', gradingSystemSchema);
