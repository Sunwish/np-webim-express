var dao = require('./dao');

exports.handleApp =
function handleApp (app) {
    app.get('/', (req, res) => {
        res.send('<h1>Hello World!</h1>');
    });

    app.get('/getMessages', (req, res) => {
        dao.getAllMessages(function(err, msgs){
            if(err) {
                res.send("<h1>" + err + "</h1>");
                return;
            }
            res.json(msgs);
        })
    })

    app.get('/api/getTest', (req, res) => {
        res.send('<h1>Welcome to post test page!</h1>');
    });

    app.post('/api/postTest', (req, res) => {
        res.send('<h1>Welcome to post test page!</h1>');
    });

    app.post('/api/getMessages', (req, res) => {
        dao.getAllMessages((err, msgs) => {
            res.json({
                'errMessage': err,
                'result': msgs
            })
        })
    });

    app.post('/api/createMessage', (req, res) => {
        let msg = req.body;
        dao.insertMessage(msg.id, msg.sender, msg.content, (err) => {
            res.json(err);
        })
    })
    app.post('/api/deleteMessage', (req, res) => {
        dao.deleteMessage(req.body.id, (err) => {
            res.json(err);
        })
    })

    app.post('/api/getAllUsers', (req, res) => {
        dao.getAllUsers((err, users) => {
            res.json({
                "errMessage": err,
                "result": users
            })
        })
    })

    app.post('/api/getUserByUserId', (req, res) => {
        dao.getUserByUserId(req.body.id, (err, user) => {
            res.json({
                "errMessage": err,
                "result": user
            });
        })
    })

    app.post('/api/addFriend', (req, res) => {
        dao.addFriend(req.body.id1, req.body.id2, (err) => {
            res.json({
                "errMessage": err
            })
        })
    })

    app.post('/api/getAllFriendsId', (req, res) => {
        dao.getAllFriends(req.body.id, (err, friends) => {
            res.json({
                "errMessage": err,
                "result": friends
            })
        })
    })
}