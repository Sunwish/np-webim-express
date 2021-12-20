const mongo = require('mongoose');
const models = require('./models');
var utils = require('./utils');
var bodyParser = require('body-parser');

exports.connect =
function connect(app, connectString) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    return new Promise((resolve, reject) => {
        mongo.connect(connectString, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }, (err) => {
            if (err) { return reject(err); }
            resolve(null);
        });
    })
}
////////////////////////////////////// ABOUT CHATROOM MESSAGE
exports.insertChatroomMessageAsync =
function insertChatroomMessageAsync (sender, content, time) {
    return new models.chatroomMessageModel ({
        sender: sender,
        content: content,
        time: time
    }).save()
    .then(res => {
        return res.populate('sender')
        .then(res => [null, res])
        .catch(err => [err]);
    })
    .catch(err => [err]);   
}

exports.getChatroomMessagesAsync =
function getChatroomMessagesAsync () {
    return models.chatroomMessageModel.find({}).populate('sender').exec()
    .then(res => [null, res])
    .catch(err => [err]);
}

////////////////////////////////////// INSERT MESSAGE
exports.insertMessage =
function insertMessage (id, sender, content, callback){
    new models.messageModel({
        id: id,
        sender: sender,
        receiver: receive,
        content: content
    }).save(callback);
}
exports.insertMessageAsync =
function insertMessageAsync (id, sender, receiver, content){
    return new models.messageModel({
        id: id,
        sender: sender,
        receiver: receiver,
        content: content
    }).save()
    .then(async result => {
        [err, res] = await insertFriendMessageAsync (id, sender, receiver, result._id);
        return [err, result];
    })
    .catch(err => [err]);
}

//////////////////////////////////////// INSERT FRINED MESSAGE

function insertFriendMessageAsync (id, sender, receicer, messageId) {
    console.log("inserted message id: " + messageId);
    return new models.friendMessageModel({
        user_id_pair: [sender, receicer].sort(),
        message: messageId
    }).save()
    .then(result => [null, result])
    .catch(err => [err]);
}

////////////////////////////////////// DELETE MESSAGE
exports.deleteMessage =
function deleteMessage (id, callback) {
    models.messageModel.deleteOne({
        id: id
    }, callback);
}
exports.deleteMessageAsync =
function deleteMessageAsync (id) {
    return models.messageModel.deleteOne({
        id: id
    }).exec()
    .then(result => [null, result])
    .catch(err => [err]);
}

////////////////////////////////////// GET USERS
exports.getAllUsers = 
function getAllUsers (callback) {
    models.userModel.find({}, callback);
}
exports.getAllUsersAsync =
function getAllUsersAsync () {
    return models.userModel.find({}).exec()
    .then(result => [null, result])
    .catch(err => [err, null]);
}

//////////////////////////////////////// GET MESSAGES
exports.getAllMessages =
function getAllMessages (callback) {
    models.messageModel.find({}, callback);
}
exports.getAllMessagesAsync =
function getAllMessagesAsync () {
    return models.messageModel.find({}).exec()
    .then(result => [null, result])
    .catch(err => [err]);
}

//////////////////////////////////////// GET USER BY ID
exports.getUserByUserId =
function getUserByUserId (user_id, callback) {
    models.userModel.findOne({
        id: user_id
    }, callback);
}
exports.getUserByUserIdAsync =
function getUserByUserIdAsync (user_id) {
    return models.userModel.findOne({
        id: user_id
    }).exec()
    .then(result => [null, result])
    .catch(err => [err]);
}

//////////////////////////////////////// GET USER BY ID
exports.getUserByUsernameAsync =
function getUserByUsernameAsync (username) {
    return models.userModel.findOne({
        username: username
    }).exec()
    .then(result => [null, result])
    .catch(err => [err]);
}

///////////////////////////////////////// ADD FRIEND
exports.addFriend = 
function addFriend (user_id_A, user_id_B, callback) {
    if(user_id_A == null || user_id_B == null) {
        callback("[ERR] User id cannot be null.");
        return;
    }
    new models.friendModle({
        user_id_pair: [user_id_A, user_id_B]
    }).save(callback);
}
exports.addFriendAsync = 
function addFriendAsync (user_id_A, user_id_B) {
    if(user_id_A == null || user_id_B == null) {
        callback("[ERR] User id cannot be null.");
        return;
    }
    return new models.friendModle({
        user_id_pair: [user_id_A, user_id_B]
    }).save()
    .then(result => [null, result])
    .catch(err => [err]);
}

/////////////////////////////////////////// GET FRIENDS
exports.getAllFriends =
function getAllFriends (user_id, callback) {
    var friend_id_list = [];
    models.friendModle.where('user_id_pair').in(user_id).exec()
    .then(friends => {
        for(friend of friends){
            friend_id_list.push(
                friend.user_id_pair[0] == user_id
                ? friend.user_id_pair[1]
                : friend.user_id_pair[0]);
        }
        callback(null, friend_id_list);
    })
    .catch(err => {
        callback(err);
    })
}
exports.getAllFriendsAsync =
function getAllFriendsAsync (user_id) {
    var friend_id_list = [];
    return models.friendModle.where('user_id_pair').in(user_id).exec()
    .then(friends => {
        for(friend of friends){
            friend_id_list.push(
                friend.user_id_pair[0] == user_id
                ? friend.user_id_pair[1]
                : friend.user_id_pair[0]);
        }
        return [null, friend_id_list];
    })
    .catch(err => [err]);
}

//////////////////////////////////////////
exports.getFriendMessages = 
function getFriendMessages (user_id_pair, callback) {
    models.friendMessageModel.find({
        user_id_pair: user_id_pair
    }, callback)
}
exports.getFriendMessagesAsync = 
async function getFriendMessagesAsync (user_id_pair) {
    return models.friendMessageModel.find({
        user_id_pair: user_id_pair.sort()
    }).populate('message').exec()
    .then(result => [null, result])
    .catch(err => [err]);
}