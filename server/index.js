const io = require('socket.io')();

// Array of users to hold state
let users = [];

io.on('connection', (client) => {

  // Send array of users to the client
  client.on('users', () => {
    io.to(client.id).emit(users);
  });

  // Send chat message
  client.on('chat', chat => {
    console.log(chat);
  });

  // Call another user
  client.on('call', call => {
    console.log(call);
  });

  /* WebRTC signalling */
  
  // Got offer from peer
  client.on('offer', offer => {
    console.log(offer);
  });

  // Got answer from peer
  client.on('answer', answer => {
    console.log(answer);
  });
});

io.listen(3001);
console.log('Listening on port 3001.');