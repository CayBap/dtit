const Question = require('../../models/question.js');
const Roles = require('../../models/role.js');
const Players = require('../../models/players.js');
let Answer1 = 0;
let Answer2 = 0;
let Answer3 = 0;
let Answer4 = 0;
module.exports = function(socket) {
  return function(data) {
    console.log(data);
    if (data.command === 1000 || data.command === 1001) {
      const question = Question.findById(data.message);
      question.then(quest => {
        if (!quest) {
          res.json({
            code: config.CODE_ERR_WITH_MESS,
            message: 'question not found'
          });
          return;
        }
        // let test = new Roles({
        //   name: 'test'
        // });
        // test.save();
        // Roles.findById('5ae87aca4c7d670f40499b1a', function(err, tank) {
        //   tank.set({ name: 'rename' });
        //   tank.save();
        // });

        socket.broadcast.emit('receiveQuestion', { message: quest });
      });
    }
    if (data.command == 911) {
      socket.broadcast.emit('SOS', { message: 'stop' });
    }
    if(data.command == 404){
      console.log("ok");
      Players.find().then(result=>{
        for(let i  = 0;i<result.length;i++){
          Players.findById(result[i]._id).then(play=>{
            play.status  = true;
            play.lastTime = 0;
            play.save();
          }).catch(err=>console.log(err));

        }
      }).catch(err=>console.log(err));
    }
    if (data.command == 1997) {
      console.log(data);
      var question = Question.findById(data.req.questionId);
      var player_id;
      var player = Players.find({
        studentId: data.req.studentId
      });
      player.then(player => {
        this.player_id = player[0]._id;
        console.log(this.player_id);
        question.then(quest => {
          if (quest.correctAnswer != data.req.answer) {
            Players.findById(this.player_id, function(err, player) {
              player.set({
                status: false
              });
              player.save();
            });
          } else {
            Players.findById(this.player_id, function(err, player) {
              player.set({
                lastTime: data.req.time
              });
              player.save();
            });
          }
        });
      });
    }
    if (data.command == 113) {
      console.log('start check');
      var player = Players.find({
        studentId: data.message
      });

      player.then(player => {
        console.log('runtothen');
        if (player[0].status == false) {
          socket.emit('checked', { res: { code: 0, message: 'dabiloai' } });
          // res.json({
          //   code: 0,
          //   message: 'Da bi loai'
          // });
        } else {
          if (player[0].lastTime < 0) {
            socket.emit('checked', { res: { code: 0, message: 'dabiloai' } });
            // res.json({
            //   code: 0,
            //   message: 'Da bi loai'
            // });
          } else {
            Players.findById(player[0]._id, function(err, player) {
              player.set({
                lastTime: -10
              });
              player.save();
            });
            socket.emit('checked', { res: { code: 1, message: 'koloai' } });
            // res.json({
            //   code: 1,
            //   message: 'Khong bi loai'
            // });
          }
        }
      });
    }
    if (data.command === 3000) {
      console.log(data.message);
      socket.broadcast.emit('viewerSubmit', { message: data.message });

      // switch (data.message) {
      //   case 1: {
      //     socket.emit('viewerSubmit', {message: data.Answer1});
      //     break;
      //   }
      //   case 2: {
      //     this.Answer2++;
      //     console.log(this.Answer2);
      //     break;
      //   }
      //   case 3: {
      //     this.Answer3++;
      //     console.log(this.Answer3);
      //     break;
      //   }
      //   case 4: {
      //     this.Answer4++;
      //     console.log(this.Answer4);
      //     break;
      //   }
      // }
    }
  };
};
