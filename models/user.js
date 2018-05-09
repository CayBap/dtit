// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//setup a mongoose model and pass it using module.export
var user = new Schema({
    phone:String,
    name: String,
    studentId: String,
    pass: String,
    
    isLocked: Boolean,
    isOnline: Boolean,
	role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    timePassChange: Number,
    time : Number, 
    status : Boolean, 
    score : Number, 
    answered : Boolean
}, {timestamps: true} );



module.exports = mongoose.model('User', user);