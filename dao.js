const mongo = require('mongoose');
const models = require('./models');
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

exports.insertMessage =
function insertMessage (id, sender, content, callback){
    new models.messageModel({
        id: id,
        sender: sender,
        content: content
    }).save(callback);
}

exports.deleteMessage =
function deleteMessage (id, callback) {
    models.messageModel.deleteOne({
        id: id
    }, callback);
}

exports.getAllUsers = 
function getAllUsers (callback) {
    models.userModel.find({}, callback);
}

exports.getAllMessages =
function getAllMessages (callback) {
    models.messageModel.find({}, callback);
}

exports.getUserByUserId =
function getUserByUserId (user_id, callback) {
    models.userModel.findOne({
        id: user_id
    }, callback);
}

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