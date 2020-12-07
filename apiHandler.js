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

    app.post('/api/getUserByUserId', (req, res) => {
        dao.getUserByUserId(req.body.id, (err, user) => {
            res.json({
                "errMessage": err,
                "result": user
            });
        })
    })

}