const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String,
        min:6
    },
    gender:{
        type:String
    },
    profilePicture:{
        type:String
    }

})

module.exports = mongoose.model("user", userSchema);
