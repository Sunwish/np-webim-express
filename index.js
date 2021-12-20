var app = require('express')();
var http = require('http').createServer(app);
var dao = require('./dao');
var models = require('./models'); // just for db test
var apiHandler = require('./apiHandler');
var cors = require('cors');
const { Mongoose } = require('mongoose');

app.use(cors());
dao.connect(app, 'mongodb://127.0.0.1:27017/WebIM')
.then(() => {
    console.log("Connect to mongodb successed.");
    console.log("Run db test start");
    dbTest();
    console.log("Run db test end");
    http.listen(80, () => {
        console.log('listening on *:80');
    })
    apiHandler.handleApp(app);
})
.catch((err) => {
    console.log("Fail to connect to mongodb");
}); 

async function dbTest () {
    /*
    let friendPair = [1, 0];
    let queryRes = await models.friendMessageModel.find({
        user_id_pair: friendPair.sort()
    }).exec();
    console.log(queryRes);
    */
}