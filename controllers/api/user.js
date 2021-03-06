var express = require('express');
var router = express.Router();

var auth = require('../../middlewares/authenticate.js');

var User = require('../../models/user.js'); // get our mongoose model
var Role = require('../../models/role.js'); // get our mongoose model
var passHelper = require('../../helpers/encrypt.js');
const config = require('../../config.js');


router.post('/', auth, function(req, res) {

    // // find the user
    User.findOne({
        $or: [{ 'phone': req.body.phone }, { 'studentId': req.body.studentId }]
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            if (!req.body.phone || !req.body.pass || req.body.phone.length < 10 || req.body.phone.length > 14 || req.body.pass.length < 6) {
                res.json({ code: config.CODE_ERR_WITH_MESS, message: 'phone is not in correct length' });
                return;
            }

            if (!req.body.studentId || req.body.studentId.length != 10) {
                res.json({ code: config.CODE_ERR_WITH_MESS, message: 'studentId is not in correct length' });
                return;
            }

            Role.findOne({
                name: 'user'
            }, function(err, role) {

                if (err) throw err;

                var nick = new User({
                    phone: req.body.phone,
                    pass: passHelper.hash(req.body.pass),
                    studentId: req.body.studentId,
                    name: req.body.name,
                    isLocked: false,
                    isOnline: false,
                    timePassChange: Date.now() / 1000 | 0,
                    role: role._id
                });
                nick.save(function(err) {
                    if (err) {
                        res.json({ code: config.CODE_ERR_WITH_MESS, message: 'Error: ' + err });
                        return;
                    }

                    res.status(201).json({ code: config.CODE_OK_WITH_MESS, id: nick._id });
                    return;
                });
            });

        } else if (user) {

            //user already exist
            res.json({ code: config.CODE_ERR_WITH_MESS, message: 'User/studentId already exist' });
            return;

        }

    });
});
router.get('/check', auth, function(req, res) {
    res.json({ code: config.CODE_OK });
});

router.post('/self', function(req, res) {
    console.log(req.body);
    User.findOne({
        $or: [{ 'phone': req.body.phone }, { 'studentId': req.body.studentId }]
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            if (!req.body.phone || !req.body.pass || req.body.phone.length < 10 || req.body.phone.length > 14 || req.body.pass.length < 6) {
                res.json({ code: config.CODE_ERR_WITH_MESS, message: 'phone is not in correct length' });
                return;
            }

            if (!req.body.studentId || req.body.studentId.length != 10) {
                res.json({ code: config.CODE_ERR_WITH_MESS, message: 'studentId is not in correct length' });
                return;
            }

            Role.findOne({
                name: 'user'
            }, function(err, role) {

                if (err) throw err;

                var nick = new User({
                    phone: req.body.phone,
                    pass: passHelper.hash(req.body.pass),
                    studentId: req.body.studentId,
                    name: req.body.name,
                    isLocked: false,
                    isOnline: false,
                    timePassChange: Date.now() / 1000 | 0,
                    role: role._id
                });
                nick.save(function(err) {
                    if (err) {
                        res.json({ code: config.CODE_ERR_WITH_MESS, message: 'Error: ' + err });
                        return;
                    }

                    res.status(201).json({ code: config.CODE_OK_WITH_MESS, id: nick._id });
                    return;
                });
            });

        } else if (user) {

            //user already exist
            res.json({ code: config.CODE_ERR_WITH_MESS, message: 'User/studentId already exist' });
            return;

        }

    });
});


router.get('/', auth, function(req, res) {
    if (req.decoded.role != 'user') {
        const query = Role.findOne({ name: 'user' });
        query.then((role) => {
                return User.find({ role: role._id }, 'name phone studentId isLocked isOnline');
            })
            .then((users) => {
                res.json({ code: config.CODE_OK_WITH_MESS, users });
            })
            .catch((err) => {
                res.json({ code: config.CODE_ERR_WITH_MESS, message: 'Error: ' + err });
            });
    } else {
        res.status(403).json({ code: config.CODE_ERR_WITH_MESS, message: 'Access denied' }).end();
    }
});

router.get('/online', auth, function(req, res) {
    if (req.decoded.role != 'user') {
        const query = Role.findOne({ name: 'user' });
        query.then((role) => {
                return User.find({ role: role._id, isOnline: true }, 'name phone studentId isLocked isOnline');
            })
            .then((users) => {
                res.json({ code: config.CODE_OK_WITH_MESS, users });
            })
            .catch((err) => {
                res.json({ code: config.CODE_ERR_WITH_MESS, message: 'Error: ' + err });
            });
    } else {
        res.status(403).json({ code: config.CODE_ERR_WITH_MESS, message: 'Access denied' }).end();
    }
});

router.put('/:uid', auth, function(req, res) {
    if (req.decoded.role == 'admin') {
        const update = User.findById(req.params.uid);
        update.then((user) => {
                if (!user) {
                    res.json({ code: config.CODE_ERR_WITH_MESS, message: 'user not found' });
                    return;
                }

                user.name = req.body.name;
                user.pass = passHelper.hash(req.body.pass);
                user.isLocked = req.body.isLocked;
                return user.save();
            })
            .then(() => {
                res.json({ code: config.CODE_OK });
            });
    } else {
        res.status(403).json({ code: config.CODE_ERR_WITH_MESS, message: 'Access denied' }).end();
    }
});

module.exports = router;