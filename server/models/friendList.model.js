const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendListSchema = new Schema({
  name: { type:String },
  friends: [ { type:String } ]
})

module.exports = mongoose.model("friendList",friendListSchema);
