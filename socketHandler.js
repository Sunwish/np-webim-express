
exports.handleSocket = 
function handleSocket (socket) {
    console.log('A user connected!');

    socket.on('disconnect', () => {
        console.log('User disconnected.');
    })

    socket.on('chat_message', (message) => {
        // console.log('Received message: ' + message);
    })

}