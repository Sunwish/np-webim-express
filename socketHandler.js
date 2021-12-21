
exports.handleSocket = 
function handleSocket (socket, maintain) {
    // console.log('A user connected!');

    socket.on('disconnect', () => {
        // Remove from onlineUsers list mantained by server
        const i = maintain.onlineUsers.findIndex(user => user.connId == socket.id);
        i > -1 && maintain.onlineUsers.splice(i, 1);
        console.log('User disconnected.', socket.id, 'Online count: ', maintain.onlineUsers.length);

        // Broadcast disconnect event to all online users
        socket.broadcast.emit('user_disconnect', socket.id);
    })

    socket.on('chat_message', (message) => {
        // console.log('Received message: ' + message);
    })

}