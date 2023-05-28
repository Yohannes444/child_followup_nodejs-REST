const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  students: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'child',
      required: true
    },
    teacherId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true},
    present: {
      type: Boolean,
      required: true
    }
  }]
},
{
  timestamps: true,
});

module.exports = mongoose.model('Attendance', attendanceSchema);
