var mongoose =require('mongoose')
var  Schema=mongoose.Schema


var StudentWightListSchema= new Schema({
    
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
    transcript:{
        type:String,
        require:true,
        default:''
    },
    receipt:{
        type:String,
        default:''
    },
    section:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    parent:{
        tyep:mongoose.Schema.Types.ObjectId,
    },
    aproved:{
        type:Boolean,
    }
})

module.exports = mongoose.model('child',StudentWightListSchema)