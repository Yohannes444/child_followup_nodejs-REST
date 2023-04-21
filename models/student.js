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
    },
    section:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    
})

module.exports = mongoose.model('child',ChildSchema)