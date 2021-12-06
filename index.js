var app = require('express')();
var http = require('http').createServer(app);
var dao = require('./dao');
var apiHandler = require('./apiHandler');
var cors = require('cors');

app.use(cors());
dao.connect(app, 'mongodb://127.0.0.1:27017/WebIM')
.then(() => {
    console.log("Connect to mongodb successed.");
    http.listen(80, () => {
        console.log('listening on *:80');
    })
    apiHandler.handleApp(app);
})
.catch((err) => {
    console.log("Fail to connect to mongodb");
}); 


