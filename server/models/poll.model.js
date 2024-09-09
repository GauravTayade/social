const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = new Schema({
  pollUser:{
    type:String
  },
  pollQuestion:{
    type:String
  },
  pollFriendList:{
    type:String
  },
  images:[{type:String}],
  active:{
    type:Boolean
  }
})

module.exports = mongoose.model("poll",pollSchema)
