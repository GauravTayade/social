const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const voteSchema = new Schema({
  pollId:{type:String},
  option1:[{type:String}],
  count1:{type:Number},
  option2:[{type:String}],
  count2:{type:Number}
})

module.exports=mongoose.model("vote",voteSchema);
