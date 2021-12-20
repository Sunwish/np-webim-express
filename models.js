const mongo = require('mongoose');

var chatroomMessageSchema = mongo.Schema({
    sender: {
        type: mongo.Schema.ObjectId,
        ref: 'users'
    },
    content: String,
    time: Date
})

var userSchema = mongo.Schema({
    id: Number,
    username: String,
    avater: String
})

var messageSchema = mongo.Schema({
    id: Number,
    sender: Number,
    receiver: Number,
    content: String
})

var friendSchema = mongo.Schema({
    user_id_pair: Array
})

var friendMessageSchema = mongo.Schema({
    user_id_pair: Array,
    message: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'messages'
    }
})

/////////////////////////////////////////////////////////////////

var messageModel = mongo.model('messages', messageSchema);
exports.messageModel = messageModel;

var userModel = mongo.model('users', userSchema);
exports.userModel = userModel;

var friendModle = mongo.model('friends', friendSchema);
exports.friendModle = friendModle;

var friendMessageModel = mongo.model('friend_messages', friendMessageSchema);
exports.friendMessageModel = friendMessageModel;

var chatroomMessageModel = mongo.model('chatroom_messages', chatroomMessageSchema);
exports.chatroomMessageModel = chatroomMessageModel;