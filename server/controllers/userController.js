require('dotenv').config();
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

exports.login = async (req, res, next) => {
  if (req.body.loginData.data.username !== '' &&
    req.body.loginData.data.password !== '') {
    const user = User.findOne({email: req.body.loginData.data.username}, (err, doc) => {
      if (doc) {
        bcrypt.compare(req.body.loginData.data.password, doc.password, (err, result) => {
          if (result) {
            res.status(200).send({
              response: {
                status: 1,
                message: "Valid user record",
                userData: {
                  userId: doc._id,
                  name: doc.name,
                  email: doc.email,
                  gender:doc.gender
                }
              }
            })
          } else {
            res.status(200).send({
              response: {
                status: 0,
                message: "Invalid Credentials"
              }
            })
          }
        })
      } else {
        res.status(400).send({
          response: {
            status: 0,
            message: "Invalid Credentials"
          }
        })
      }
    });
  }

}

exports.register = async (req, res, next) => {

  if (req.body.userInfo) {
    const userData = req.body.userInfo;
    if (userData.name !== '' &&
      userData.email !== '' &&
      userData.password.length >= 6) {

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(userData.password, salt, (err, hash) => {
          const user = new User({
            name: userData.name,
            email: userData.email,
            password: hash,
            gender:userData.gender
          })

          user.save()
            .then(result => {
              res.status(201).send({
                response: {
                  status: true,
                  message: "Record SuccessFully Saved"
                }
              })
            })
            .catch(error => {
              res.status(400).send({
                response: {
                  status: false,
                  message: "Unable to save record"
                }
              })
            })
        })
      })

    } else {
      res.status(400).send({
        response: {
          status: false,
          message: "All fields are required and password must be >6 characters"
        }
      })
    }
  } else {
    res.status(400).send({
      response: {
        status: false,
        message: "Something went wrong! Please try again."
      }
    })
  }
}

exports.getUsers = (req, res, next) => {
  User.find({name: {$regex: new RegExp('.*' + req.query.key + '*.', "i")}})
    .then(docs => {
      res.status(200).send({
        status: 1,
        response: docs
      })
    })
    .catch(error => {
      console.log(error)
    })
}

exports.getUser = (req, res, next) => {
  User.findById(req.params.userid)
    .then(doc => {
      res.status(200).send({
        status: 1,
        response: doc
      })
    })
    .catch(error => {
      console.log(error)
    })
}

exports.getOnlineUsers = (req,res,next)=>{
  res.send(req.query.userId)
}
