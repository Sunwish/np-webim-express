var dao = require('./dao');

exports.handleApp =
function handleApp (app, io, maintain) {
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
    app.post('/api/whoami', async (req, res) => {
        if(req.session.loginUserInfo) {
            res.json({
                "result": req.session.loginUserInfo
            })
            return;
        }
        res.json({});
    })

    app.post('/api/login', async (req, res) => {
        if(req.session.loginUserInfo) {
            //console.log('session: ', req.session.loginUserInfo);
            res.json({
                "errMessage": err,
                "result": req.session.loginUserInfo
            })
            return;
        } else {
            let [err, result] = await dao.getUserByUsernameAsync(req.body.username);
            if(result) {
                // login success
                req.session.loginUserInfo = result;
                //console.log('set session: ', req.session.loginUserInfo);
                console.log('create a loginUserInfo session.');
            }
            res.json({
                "errMessage": err,
                "result": result
            })
        }
    })
    
    app.post('/api/logout', async (req, res) => {
        req.session.loginUserInfo = null;
        res.json({
            'result': ''
        })
    })

    app.post('/api/onlineUser', (req, res) => {
        if(req.body.connId == undefined) {
            res.json({
                'errMessage': 'Online connect id cannot be undefine',
            });
            return;
        }

        let userWithConnId = {};
        // Copy userObjcet to userWithConnId
        Object.assign(userWithConnId, req.body.user);
        userWithConnId.connId = req.body.connId;
        
        // Insert into onlineUser list on server
        const i = maintain.onlineUsers.findIndex(user => user.connId == userWithConnId.connId);
        i ==-1 && maintain.onlineUsers.push(userWithConnId);
        console.log('user login sucessed: ', userWithConnId.connId,
        'Online count: ', maintain.onlineUsers.length);
        
        // Broadcast online event to all online users
        io.emit('user_connect', JSON.stringify(userWithConnId));
        
        res.json({
            "errMessage": null,
            "result": null
        })
    })

    app.get('/api/onlineUsers', (req, res) => {
        res.json({
            "errMessage": null,
            "result": maintain.onlineUsers
        })
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