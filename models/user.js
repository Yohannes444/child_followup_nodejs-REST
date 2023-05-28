var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')

var User = new Schema({
      firstName: {
        type: String,
          default: '',
          require:true
      },
      lastName: {
        type: String,
          default: '',
          require:true
      },
      email:{
        type:String,
        default:'',
        require:true
      },
    facebookId:String,
    parent:{
      type:Boolean,
      default:true
    },
    admin:   {
        type: Boolean,
        default: false
    },
    teacher:{
      type:Boolean,
      default:false,
    },
    cashier:{
      type:Boolean,
      default:false
    },
    active:{
      type:Boolean,
      default:true
    }

},
{
  timestamps: true,
});
User.plugin(passportLocalMongoose)

module.exports = mongoose.model('user', User);