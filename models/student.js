var mongoose =require('mongoose')
var  Schema=mongoose.Schema


var ChildSchema= new Schema({
    
    firstName:{
        type:String,
        default:'',
        require:true
    },
    lastName:{
        type:String,
        default:'',
        require:true
    },
    photo:{
        type:String,
        require
    },
    transcript:{
        type:String,
        require:true
    },
    receipt:{
        type:String,
        default:''
    },
    parent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    section:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Classroom',
        require:true
    },
    
},
{
  timestamps: true,
})

module.exports = mongoose.model('child',ChildSchema)