const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post("/login",userController.login);
router.post("/register",userController.register);
router.get('/search',userController.getUsers);
router.get('/get/:userid',userController.getUser);
router.get('/getOnline',userController.getOnlineUsers)

module.exports = router;
