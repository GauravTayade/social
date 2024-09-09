const express = require('express');
const router = express.Router();
const pollController = require("../controllers/pollController");

router.get('/all',pollController.getPolls)
router.post('/create',pollController.pollCreate);
router.post('/delete',pollController.pollDelete);
router.post('/update',pollController.pollUpdate);
router.get('/get/:pollid',pollController.getPoll);

router.post('/updateVote',pollController.updateVote);

module.exports = router;
