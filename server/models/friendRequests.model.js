const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendRequestSchemas = new Schema({
  senderId:{
    type:String
  },
  receiverId: {
    type: String
  },
  type:{
    type:Number
  }
})

module.exports = mongoose.model('friendRequests',friendRequestSchemas);
