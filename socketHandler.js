
exports.handleSocket = 
function handleSocket (socket) {
    // console.log('A user connected!');

    socket.on('disconnect', () => {
        console.log('User disconnected.', socket.id);
        socket.broadcast.emit('user_disconnect', socket.id);
    })

    socket.on('chat_message', (message) => {
        // console.log('Received message: ' + message);
    })

}