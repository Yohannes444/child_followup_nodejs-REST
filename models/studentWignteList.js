var mongoose =require('mongoose')
var  Schema=mongoose.Schema


var StudentWightListSchema= new Schema({
    
    firstName:{
        type:String,
        default:'',
       
    },
    lastName:{
        type:String,
        default:'',
         
    },
    photo:{
        type:String,
        require
    },
    transcript:{
        type:String,
         
        default:''
    },
    receipt:{
        type:String,
        default:''
    },
    selectedClassRoom:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Classroom',
        
    },
    parent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        
    }
   
})

module.exports = mongoose.model('wightList',StudentWightListSchema)