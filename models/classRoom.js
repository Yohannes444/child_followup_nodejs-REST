var mongoose=require('mongoose')
const Schema=mongoose.Schema

const TeacherSchema = new Schema({
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})
const StudentsSchema = new Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'child'
    }
})
var classRoom = new Schema({
    className:{
        type:String,
        default:'',
        require:true,
    },
    clasSize:{
        type:Number,
        default:0,
        require:true
    },
    teachersList:[TeacherSchema],
    StudentsList:[StudentsSchema]
})

var ClassRoom =  mongoose.model('Classroom',classRoom)
module.exports =ClassRoom