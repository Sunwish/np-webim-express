var app = require('express')();
var http = require('http').createServer(app);
var dao = require('./dao');
var models = require('./models'); // just for db test
var apiHandler = require('./apiHandler');
var socketHandler = require('./socketHandler');
var cors = require('cors');
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

app.use(cors());
dao.connect(app, 'mongodb://127.0.0.1:27017/WebIM')
.then(() => {
    console.log("Connect to mongodb successed.");
    console.log("Run db test start");
    dbTest();
    console.log("Run db test end");

    apiHandler.handleApp(app, io);

    // Socket.io listening
    io.on('connection', (socket) => {
        io.emit('from_server', 'Hi client!');
        socketHandler.handleSocket(socket);
    })

    // http listening
    http.listen(80, () => {
        console.log('listening on *:80');
    })
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