var mongoose=require('mongoose')
const Schema=mongoose.Schema

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
    teachersList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    StudentsList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'child'
    }]
},
{
  timestamps: true,
})

var ClassRoom =  mongoose.model('Classroom',classRoom)
module.exports =ClassRoom