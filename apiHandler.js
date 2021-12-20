var dao = require('./dao');

exports.handleApp =
function handleApp (app, io) {
    app.get('/', (req, res) => {
        res.send('<h1>Hello World!</h1>');
    });

    app.get('/api/test', (req, res) => {
        res.send('<h1>Welcome to post test page!</h1>');
    });

    app.post('/api/test', (req, res) => {
        res.send('<h1>Welcome to post test page!</h1>');
    });

    //////////////////////////////////////////////////////////
    app.post('/api/login', async (req, res) => {
        let [err, result] = await dao.getUserByUsernameAsync(req.body.username);
        res.json({
            "errMessage": err,
            "result": result
        })
        if(result) {
            io.emit('user_connect', JSON.stringify(result));
        }
    })

    app.post('/api/chatroomMessage', async (req, res) => {
        [err, result] = await dao.insertChatroomMessageAsync(req.body.sender, req.body.content, req.body.time);
        res.json({
            'errMessage': err,
            'result': result
        });
        // Broadcast message to all socket.io connections
        if(err == null){
            io.emit('chat_message', JSON.stringify(result));
        }
    })

    app.get('/api/chatroomMessages', async (req, res) => {
        [err, result] = await dao.getChatroomMessagesAsync();
        res.json({
            'errMessage': err,
            'result': result
        });
    })
    //////////////////////////////////////////////////////////

    app.get('/api/messages', async (req, res) => {
        [err, result] = await dao.getAllMessagesAsync();
        res.json({
            'errMessage': err,
            'result': result
        });
    });
    /*
    app.post('/api/message', (req, res) => {
        let msg = req.body;
        dao.insertMessage(msg.id, msg.sender, msg.content, (err, result) => {
            res.json({
                "errMessage": err,
                "result": result
            });
        })
    })
    */
    app.post('/api/message', async (req, res) => {
        let msg = req.body;
        [err, result] = await dao.insertMessageAsync(msg.id, msg.sender, msg.receiver, msg.content);
        res.json({
            "errMessage": err,
            "result": result
        });
    })

    app.delete('/api/message', async (req, res) => {
        [err, result] = await dao.deleteMessageAsync(req.body.id);
        res.json({
            "errMessage": err,
            "result": result
        });
    })

    app.get('/api/friendMessages/:id1/:id2', async(req, res) => {
        [err, reses] = await dao.getFriendMessagesAsync([+req.params.id1, +req.params.id2]);
        let result = [];
        for(r of reses) {
            result.push(r.message);
        }
        res.json({
            "errMessage": err,
            "result": result
        });
    })

/*
    app.get('/api/users', (req, res) => {
        dao.getAllUsers((err, users) => {
            res.json({
                "errMessage": err,
                "result": users
            })
        })
    })
*/
    app.get('/api/users', async (req, res) => {
        let [err, result] = await dao.getAllUsersAsync()
        res.json({
            "errMessage": err,
            "result": result
        })
        
    })

    app.get('/api/user/:id', async (req, res) => {
        [err, result] = await dao.getUserByUserIdAsync(+req.params.id);
        res.json({
            "errMessage": err,
            "result": result
        });
    })

    app.post('/api/friend', async (req, res) => {
        [err, result] = await dao.addFriendAsync(req.body.id1, req.body.id2);
        res.json({
            "errMessage": err,
            "result": result
        });
    })

    app.get('/api/friendsId/:selfId', async (req, res) => {
        [err, result] = await dao.getAllFriendsAsync(+req.params.selfId);
        res.json({
            "errMessage": err,
            "result": result
        });
    })

    app.get('/api/avater/:fileName', (req, res) => {
        res.sendFile(process.cwd() + '/imgs/' + req.params.fileName);
    })
}