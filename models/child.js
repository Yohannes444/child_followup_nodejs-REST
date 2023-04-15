var mongoose =require('mongoose')
var  Schema=mongoose.Schema


var ChildSchema= new Schema({
    parent:mongoose.Schema.Types.ObjectId,
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
    Ssection:mongoose.Schema.Types.ObjectId
})

module.exports = mongoose.model('child',ChildSchema)