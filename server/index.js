const io = require('socket.io')();

// Array of clients to hold state
let users = [];

io.on('connection', (client) => {

  client.on('join', user => {
    console.log(user);
    io.to(client.id).emit('users', users);
    // Send the current array of users to the client
    client.broadcast.emit('addUser', user);
    // Add the user to the map
    users.push(user);
  });

  client.on('disconnect', () => {
    // Remove user from array and tell other clients to remove it
    for (let i = 0; i < users.length; i++) {
      if (client.id === users[i].id) {
        client.broadcast.emit('removeUser', users[i]);
        users.splice(i, 1);
        console.log(users);
      }
    }
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