const mongo = require('mongoose');

var messageSchema = mongo.Schema({
    id: Number,
    sender: Number,
    content: String
})

var messageModel = mongo.model('message', messageSchema);
exports.messageModel = messageModel;

