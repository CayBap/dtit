var express = require('express');
var router = express.Router();
var auth = require('../../middlewares/authenticate.js');
const config = require('../../config.js');
const Players = require('../../models/players.js');
const Question = require('../../models/question');

router.post('/answer', auth, (req, res) => {
  var question = Question.findById(req.body.questionId);
  var player_id;
  var player = Players.find({
    studentId: req.body.studentId
  });
  player.then(player => {
    this.player_id = player[0]._id;
  });
  question.then(quest => {
    if (quest.correctAnswer != req.body.answer) {
      Players.findById(this.player_id, function(err, player) {
        player.set({
          status: false
        });
        player.save();
      });
    } else {
      Players.findById(this.player_id, function(err, player) {
        player.set({
          lastTime: req.body.time
        });
        player.save();
      });
    }
  });
});
router.post('/check', auth, (req, res) => {
  console.log('start check');
  var player = Players.find({
    studentId: req.body.studentId
  });

  player.then(player => {
    console.log('runtothen');
    if (player[0].status == false) {
      res.json({
        code: 0,
        message: 'Da bi loai'
      });
      return;
    } else {
      if (player[0].lastTime < 0) {
        res.json({
          code: 0,
          message: 'Da bi loai'
        });
      } else {
        res.json({
          code: 1,
          message: 'Khong bi loai'
        });
      }

      return;
    }
  });
});
router.post('/checkSAT', auth, (req, res) => {
  console.log(req);
  var player = Players.find({
    studentId: req.body.studentId
  });

  player.then(player => {
    console.log('run to then');
    if (player[0].status == true && player[0].lastTime !== -10) {
      res.json({
        code: 1,
        message: 'Khong bi loai'
      });
      console.log('id:' + player[0]._id + 'ko bi loai');
      return;
    } else {
      Players.findById(player[0]._id, function(err, player) {
        player.set({
          lastTime: -10
        });
        player.save();
      });
      res.json({
        code: 0,
        message: 'Bi loai'
      });
      console.log('id:' + player[0]._id + 'bi loai');
      return;
    }
    console.log('checksat done');
  });
});
module.exports = router;
