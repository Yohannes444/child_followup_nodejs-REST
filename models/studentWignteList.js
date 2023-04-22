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
        ref:'classroom',
        
    },
    parent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'family',
        
    },
    aproved:{
        type:Boolean,
    }
})

module.exports = mongoose.model('wightList',StudentWightListSchema)