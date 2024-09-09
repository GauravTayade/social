const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const friendSchema = new Schema({
  userId: {
    type: String
  },
  friends: [{
      type: String
  }]
})

module.exports = mongoose.model("friend", friendSchema);
