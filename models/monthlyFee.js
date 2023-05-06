var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MonthlyFee = new Schema({
      receipt: {
        type: String,
          default: '',
          require:true
      },
      approved: {
        type: Boolean,
        default: false,
      }
});

module.exports = mongoose.model('monthlyFeeReceipt', MonthlyFee);