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
        console.log(req.query);
    });

    app.post('/api/postTest', (req, res) => {
        res.send('<h1>Welcome to post test page!</h1>');
        // console.log(req.headers);
        console.log(req.body);
    });

    app.post('/api/getMessages', (req, res) => {
        dao.getAllMessages((err, msgs) => {
            res.json({
                'errMessage': err,
                'messages': msgs
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
        console.log(req.body);
        dao.deleteMessage(req.body.id, (err) => {
            res.json(err);
        })
    })

}