const Question = require('../../models/question.js');
const Roles = require('../../models/role.js');
const Players = require('../../models/user.js');
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

                        message: 'question not found'
                    });
                    return;
                }
                socket.broadcast.emit('waitAdmin', {

                    message: quest,
                    command: 1000
                });
            });
        }
        if (data.command == 9999) {
            socket.broadcast.emit('waitAdmin', {
                message: 'Show answer',
                command: 9999
            });
        }
        if (data.command == 911) {
            socket.broadcast.emit('SOS', {
                code: config.CODE_OK_WITH_MESS,
                message: 'stop'
            });
        }
        if (data.command == 112) {
            Players.find().then(result => {
                for (let i = 0; i < result.length; i++) {
                    Players.findById(result[i]._id).then(play => {
                        play.status = true;
                        play.time = 0;
                        play.answered = true;
                        play.save();
                    }).catch(err => console.log(err));

                }
            }).catch(err => console.log(err));
            socket.broadcast.emit('waitAdmin', {
                code: 1,
                message: 'stop',
                command: 112
            })
        }
        if (data.command == 1997) {
            console.log(data);
            var question = Question.findById(data.req.questionId);
            var player_id;
            var player = Players.findOne({
                studentId: data.req.studentId
            });
            player.then(player => {
                this.player_id = player._id;
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
                                time: data.req.time
                            });
                            player.save();
                        });
                    }
                });
            });
        }


    };
};