var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MonthlyFee = new Schema({
      receipt: {
        type: String,
          default: '',
          require:true
      },
      studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'child',
        require:true
      },
      approved: {
        type: Boolean,
        default: false,
      },
      date:{
        type:Date,
        require:true
      }
},
{
  timestamps: true,
});

module.exports = mongoose.model('monthlyFeeReceipt', MonthlyFee);