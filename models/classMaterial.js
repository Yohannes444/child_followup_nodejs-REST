const mongoose = require('mongoose');

const educationMaterialSchema = new mongoose.Schema({
  
  
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    classRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Classroom',
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
}
},
{
  timestamps: true,
});
    
const EducationMaterial = mongoose.model('material', educationMaterialSchema);

module.exports = EducationMaterial;
