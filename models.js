const mongo = require('mongoose');

var userSchema = mongo.Schema({
    id: Number,
    username: String,
    avater: String
})

var messageSchema = mongo.Schema({
    id: Number,
    sender: Number,
    content: String
})

/////////////////////////////////////////////////////////////////

var messageModel = mongo.model('message', messageSchema);
exports.messageModel = messageModel;

var userModel = mongo.model('user', userSchema);
exports.userModel = userModel;
