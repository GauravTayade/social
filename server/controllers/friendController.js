const FriendRequests = require('../models/friendRequests.model');
const User = require('../models/user.model');
const Friend = require('../models/friends.model');
const FriendList = require('../models/friendList.model');
const {getUsers} = require("./userController");
const {promise} = require("bcrypt/promises");

exports.getFriend = async (req, res, next) => {
  console.log('get friend first method works');
}

exports.createFriendList = async (req,res,next) =>{
  const friendList = new FriendList({
    name:req.body.friendList.name,
    friends: req.body.friendList.friends
  })

  friendList.save(err=>{
    if(err){
      res.status(200).send({"status":0,"message":"Something went wrong please try again!"})
    }else{
      res.status(200).send({"status":1,"message":"Your list has been successfully crated"})
    }
  })
}

exports.deleteFriendList = async (req,res,next) => {
  if(req.body.listId){
    FriendList.deleteOne({_id:req.body.listId})
      .then(response=>{
        console.log(response)
      })
      .catch(error=>{
        console.log(error)
      })
  }
}

exports.getFriendLists = async(req,res,next)=>{
  const friendList = [];

  await FriendList.find({}).then(lists=>{
    Promise.all(lists.map(async list=>{

      const listObj = {
        name:list.name,
        id:list._id,
        friends:[]
      }

     await Promise.all(list.friends.map(async friend=>{
        await User.findById(friend).then(user=>{
          listObj.friends.push(user);
        })
      })).then(async ()=>{
        friendList.push(listObj)
     })
    })).then(async ()=>{
       res.status(200).send({status:1,response:friendList});
    })
  })
}

exports.getOnlineFriends = async (req, res, next) => {
  const userId = req.query.userid;
  await Friend.findOne({userId: userId})
    .then(doc=> {
      const friendList =  []
       Promise.all(
         doc.friends.map(async (user) => {
           await User.findOne({_id: user})
             .then((doc) => {
                friendList.push(doc);
             })
         })
       ).then(()=>{
         res.status(200).send({status: 1, friends: friendList});
          })
         .catch(error=>{

         })
    })
}

exports.getFriends = async (req, res, next) => {
  FriendRequests.find({
    $and: [{type: process.env.REQUEST_TYPE_FRIEND}],
    $or: [{senderId: req.query.userid}, {receiverId: req.query.userid}]
  })
    .then(docs => {
      res.status(200).send(docs);
    })
    .catch(error => {
      res.status(200).send(error);
    })
}

exports.getSentRequests = async (req, res, next) => {
  let sentRequests = []
  await FriendRequests.find({senderId: `${req.query.userid}`, type: process.env.REQUEST_TYPE_SENT_RECEIVED})
    .then(docs => {
      Promise.all(docs.map(async (doc) => {
        return sentRequests.push(await getUser(doc.receiverId))
      })).then(() => {
        res.status(200).send({status: 1, sentRequests: sentRequests})
      })
    })
    .catch(error => {
      console.log(error)
    })
}

const getUser = async (userId) => {
  const doc = await User.findById(userId, {password: 0})
  return doc;
}

exports.getReceivedRequests = async (req, res, next) => {
  let recivedRequests = []
  await FriendRequests.find({receiverId: `${req.query.userid}`, type: process.env.REQUEST_TYPE_SENT_RECEIVED})
    .then(docs => {
      Promise.all(docs.map(async (doc) => {
        return recivedRequests.push(await getUser(doc.senderId))
      })).then(() => {
        res.status(200).send({status: 1, receivedRequests: recivedRequests})
      })
    })
    .catch(error => {
      console.log(error)
    })
}

exports.addFriend = async (req, res, next) => {
  FriendRequests.find({senderId: req.body.userid, receiverId: req.body.friendid})
    .then(doc => {
        if (!doc || doc.length <= 0) {
          const friend = new FriendRequests({
            senderId: req.body.userid,
            receiverId: req.body.friendid,
            type: process.env.REQUEST_TYPE_SENT_RECEIVED
          })
          friend.save();
          res.status(200).send({status: 1, response: 'Your friend request has been sent'})
        } else {
          res.status(200).send({status: 1, response: 'You have already sent request'})
        }
      }
    )
    .catch(error => {
      res.status(200).send({status: 0, response: 'Something went wrong! try again'})
    })

}

exports.acceptFriend = async (req, res, next) => {

  const userId = req.body.userid;
  const friendId = req.body.friendid;

  FriendRequests.updateOne({
      senderId: userId,
      receiverId: friendId
    },
    {
      type: process.env.REQUEST_TYPE_FRIEND
    }).then(() => {
    Friend.findOneAndUpdate({userId: userId}, {"$addToSet": {"friends": friendId}}, {upsert: true})
      .then(() => {
        Friend.findOneAndUpdate({userId: friendId}, {"$addToSet": {"friends": userId}}, {upsert: true})
          .then(() => {
            res.status(200).send({status: 1, response: 'Friend request has been accepted'})
          })
          .catch(error => {
            res.status(200).send({status: 0, response: 'something went wrong! try again'})
          })
      })
      .catch(error => {
        res.status(200).send({status: 0, response: 'something went wrong! try again'})
      })
  }).catch(error => {
    res.status(200).send({status: 0, response: 'something went wrong! try again'})
  })
}

exports.cancelFriend = async (req, res, next) => {
  FriendRequests.findOneAndDelete({
    senderId: req.body.userid,
    receiverId: req.body.friendid
  })
    .then(result => {
      res.status(200).send({status: 1, response: 'You have cancelled friend request'})
    })
    .catch(error => {
      res.status(200).send({status: 0, response: 'Something went wrong! try again.'})
    })
}

exports.removeFriend = async (req, res, next) => {

  FriendRequests.findOneAndUpdate({
    'receiverId': req.body.userid,
    'senderId': req.body.friendid
  }, {$set: {type: process.env.REQUEST_TYPE_REJECTED}})
    .then(() => {
      res.status(200).send({status: 1, response: 'You have rejected request'})
    })
    .catch(error => {
      res.status(200).send({status: 0, response: 'Something went wrong! try again'})
    })
}


