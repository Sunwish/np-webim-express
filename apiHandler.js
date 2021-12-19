const { disable } = require('express/lib/application');
var dao = require('./dao');

exports.handleApp =
function handleApp (app) {
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

    app.get('/api/friendMessages/*', (req, res) => {
        req.body.
        dao.getFriendMessages()
    })

    app.get('/api/avater/:fileName', (req, res) => {
        res.sendFile(process.cwd() + '/imgs/' + req.params.fileName);
    })
}