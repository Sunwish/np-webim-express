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

exports.getAllMessages =
function getAllMessages (callback) {
    models.messageModel.find({}, callback);
}

exports.getUserByUserId =
function getUserByUserId (user_id, callback) {
    models.userModel.find({
        id: user_id
    }, callback);
}