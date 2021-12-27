////////////////////////////////////// Require modulars
var app = require('express')();
var http = require('http').createServer(app);
var cors = require('cors');
var session = require('express-session');
////////////////////////////////////// Require components
var socketHandler = require('./socketHandler');
var apiHandler = require('./apiHandler');
var dao = require('./dao');
var models = require('./models'); // just for db test
//////////////////////////////////////

const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

configurateApp(app); // configurate middleware

dao.connect(app, 'mongodb://127.0.0.1:27017/WebIM')
.then(() => {
    console.log("Connect to mongodb successed.");
    console.log("Run db test start");
    dbTest();
    console.log("Run db test end");

    let maintain = {
        onlineUsers: [],
    }
    
    apiHandler.handleApp(app, io, maintain);

    // Socket.io listening
    io.on('connection', (socket) => {
        io.emit('from_server', 'Hi client!');
        socketHandler.handleSocket(socket, maintain);
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

function configurateApp(app) {
    app.use(cors({
        credentials: true,
        origin: 'http://localhost:8093',
    }));
    app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 3
        }
    }));
}