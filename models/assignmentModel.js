const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  
  
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quation: {
        type: String,
    },
    quationFile:{
        type:String
    },
    classRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Classroom',
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
}
});

const Assignment = mongoose.model('assignment', assignmentSchema);

module.exports = Assignment;
