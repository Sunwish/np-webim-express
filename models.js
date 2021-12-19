const mongo = require('mongoose');

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
    messageId: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'messages'
    }
})

/////////////////////////////////////////////////////////////////

var messageModel = mongo.model('message', messageSchema);
exports.messageModel = messageModel;

var userModel = mongo.model('user', userSchema);
exports.userModel = userModel;

var friendModle = mongo.model('friend', friendSchema);
exports.friendModle = friendModle;

var friendMessageModel = mongo.model('friend_messages', friendMessageSchema);
exports.friendMessageModel = friendMessageModel;