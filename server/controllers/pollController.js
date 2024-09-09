require('dotenv').config();
const Poll = require("../models/poll.model");
const Votes = require("../models/votes.model");
const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs");

const extension = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
}

const S3 = new AWS.S3({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
})

const images = new Array();

exports.getPoll = async (req, res, next) => {
  const pollId = req.params.pollid;
  if (pollId) {
    Poll.findById(pollId, (error, poll) => {
      if (error) {
        res.status(200).send({'error': error})
      } else {
        res.status(200).send({'poll': poll})
      }
    })
  }
}

exports.getPolls = async (req, res, next) => {

  await Poll.find({pollUser: req.query.userid}).sort({_id:'asc'})
    .then(docs => {
      const pollsData = [];
      Promise.all(docs.map(async docPoll => {
          await Votes.findOne({pollId: docPoll._id})
            .then(docVote => {
              pollsData.push({
                poll: docPoll,
                votes: docVote
              })
            })
            .catch(error => {
              console.log(error)
            })
        })
      ).then(() => {
        res.status(200).send({polls: pollsData})
      })
        .catch(error => {
          res.status(200).send({error: error})
        })
    })
    .catch(error => {
      res.status(200).send({error: error})
    })

}

exports.pollCreate = async (req, res, next) => {

  let files = req.files;
  let body = req.body;

  if (files) {
    Promise.all(files.map(async (file) => {
      const path = await uploadFile(file);
      images.push(path.Location);
    })).then(() => {
      const poll = new Poll({
        pollUser: body.pollUser,
        pollQuestion: body.pollQuestion,
        pollFriendList: body.pollFriendList,
        images: images,
        active: true
      })

      poll.save()
        .then(response => {
          images.splice(0)
          res.status(200).send({'status': 1, 'message': 'Record successfully saved'})
        })
        .catch(error => {
          res.status(200).send({'status': 0, 'error': error})
        })
    })

  } else {
    res.status(200).send({'error': "image file dosen't exists"})
  }

}

exports.pollDelete = async (req, res, next) => {

  Poll.findById(req.body.pollId)
    .then(result => {
      if (result.images) {
        Promise.resolve(result.images.map(image => {
          S3.deleteObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: image.split('/').pop()
          }, (err, data) => {
            if (err) {
            }
          })
        })).then(() => {
          Poll.deleteOne({_id: req.body.pollId})
            .then(response => {
              if (response.deletedCount === 1) {
                res.status(200).send({'status': 1, 'message': 'Success: Poll SuccessFully Deleted'})
              }
            })
            .catch(error => {
              res.status(200).send({'status': 0, 'message': 'Error: Something went wrong'})
            })
        })
          .catch(error => {
            res.status(200).send({'status': 0, 'message': 'Error: Something went wrong'})
          })
      } else {
        Poll.deleteOne({_id: req.body.pollId})
          .then(response => {
            if (response.deletedCount === 1) {
              res.status(200).send({'status': 1, 'message': 'Success: Poll SuccessFully Delete'})
            }
          })
          .catch(error => {
            res.status(200).send({'status': 0, 'message': 'Error: Something went wrong'})
          })
      }
    })
    .catch(error => {
      res.status(200).send({'status': 0, 'message': 'Error: Something went wrong'})
    })
}

exports.pollUpdate = async (req, res, next) => {
  let files = req.files;
  let body = req.body;

  Poll.findById(req.body.pollId)
    .then(result => {
      if (req.files && result.images) {
        Promise.resolve(result.images.map(image => {
          S3.deleteObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: image.split('/').pop()
          }, (err, data) => {
            if (err) {
            }
          })
        }))
          .then(() => {
            if (files) {
              Promise.all(files.map(async (file) => {
                const path = await uploadFile(file);
                images.push(path.Location);
              }))
                .then(() => {
                  Poll.findByIdAndUpdate(req.body.pollId, {
                    pollQuestion: req.body.pollQuestion,
                    pollFriendList: req.body.pollFriendList,
                    images: images
                  })
                    .then(result => {
                      images.splice(0)
                      res.status(200).send({'status': 1, 'message': 'Record successfully updated'})
                    })
                    .catch(error => {
                      res.status(200).send({'status': 0, 'message': 'Error: Something went wrong'})
                    })
                })
            }
          })
          .catch(error => {
            res.status(200).send({'status': 0, 'message': 'Error: Something went wrong'})
          })
      }
    })
    .catch(error => {
      res.status(200).send({'status': 0, 'message': 'Error: Something went wrong'})
    })
}

const uploadFile = (file) => {

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Body: file.buffer,
    Key: Date.now() + '.' + extension[file.mimetype]
  }

  const result = S3.upload(uploadParams).promise();
  return result;
}

exports.updateVote = (req, res, next) => {
  const option = req.body.option;
  const userid = req.body.userid;
  const pollid = req.body.pollid;

  Votes.findOne({pollId: pollid})
    .then(async poll => {
      if (poll) {
        if (option === 1) {
          if (poll.option1.includes(userid)) {
            poll.option1.splice(poll.option1.indexOf(userid),1);
            Votes.findOneAndUpdate({pollId: pollid}, {
              $set: {
                "option1": poll.option1,
                "count1": poll.count1 - 1
              }
            },{new:true})
              .then(() => {
                res.status(200).send({status: 1, response: 'Your vote has been registered'})
              })
          } else {
            const optionTemp = poll.option1;
            optionTemp.push(userid)
            Votes.findOneAndUpdate({pollId: pollid}, {
              $set: {
                "option1": optionTemp,
                "count1": poll.count1 + 1
              }
            })
              .then(() => {
                res.status(200).send({status: 1, response: 'Your vote has been registered'})
              })
          }
        }
        if (option === 2) {
          if (poll.option2.includes(userid)) {
            poll.option2.splice(poll.option2.indexOf(userid),1);
            Votes.findOneAndUpdate({pollId: pollid}, {
              $set: {
                "option2": poll.option2,
                "count2": poll.count2 - 1
              }
            },{new:true},(error,doc)=>{
              res.status(200).send({status: 1, response: 'Your vote has been registered'})
            })
          } else {
            const optionTemp = poll.option2;
            optionTemp.push(userid)
            Votes.findOneAndUpdate({pollId: pollid}, {
              $set: {
                "option2": optionTemp,
                "count2": poll.count2 + 1
              }
            })
              .then(() => {
                res.status(200).send({status: 1, response: 'Your vote has been registered'})
              })
          }
        }
      } else {
        let vote = null;
        if (req.body.option === 1) {
          vote = new Votes({
            pollId: req.body.pollid,
            option1: [req.body.userid],
            count1: 1,
            option2: [],
            count2: 0
          })
        } else {
          vote = new Votes({
            pollId: req.body.pollid,
            option1: [],
            count1: 0,
            option2: [req.body.userid],
            count2: 1
          })
        }
        if(vote.save()){
          res.status(200).send({status:1,message:'Your vote has been registered'})
        }
      }
    })
    .catch(error => {

    })
}


