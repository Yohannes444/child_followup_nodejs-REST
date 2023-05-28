var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedBack = new Schema({
    firstName: {
        type: String,
          default: '',
      },
      lastName:{
        type:String,
        default:'',
      },
      phoneNumber: {
        type: Number,
        default:0,
      },
      email:{
        type:String,
        default:''
      },
      contact:{
        type:Boolean,
        default:true
      },
      reference:{
        type:String,
        default:''
      },
      feedBack:{
        type:String,
        default:''
      }
      
},
{
  timestamps: true,
});

module.exports = mongoose.model('feedBack', FeedBack);