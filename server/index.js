const io = require('socket.io')();
const { translate } = require('./translate');
require('dotenv').config();

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

  client.on('lang', lang => {
    console.log(lang.lang);
    users.forEach(user => {
      if (client.id === user.id) {
        user.lang = lang.lang;
      }
      console.log("server");
      console.log(user.lang);
    });
  });

  client.on('transcript', transcipt => {
    console.log("server transcript");

    let senderLang = null;
    let receiverLang = null;
    let receiver = null;

    for (let room in client.rooms) {
      if (room !== client.id) {
        receiver = room.replace(client.id, "");
      }
    }

    users.forEach(user => { // finding sender's language
      if (client.id === user.id) {
        senderLang = user.lang;
      }
      else if (receiver === user.id) {
        receiverLang = user.lang;
      }
    });

    if (receiverLang !== senderLang) {
      translate(transcipt, receiverLang, senderLang, (translation) => {
        transcipt = translation[0].translatedText;
        console.log(transcipt);
        for (let room in client.rooms) {
          if (room !== client.id) {
            io.to(receiver).emit('transcript', transcipt);
          }
        }
      });
    }
    else {
      //Send the chat to the receiver in the room
      for (let room in client.rooms) {
        if (room !== client.id) {
          io.to(receiver).emit('transcript', transcipt);
        }
      }
    }
  });

  // Send chat message
  client.on('chat', chat => {
    chat.key = Date.now();
    console.log("server chat");
    // know the OTHER PERSON'S lang
    // loop through users array, find the user, get their language preference, call translation

    let senderLang = null;
    let receiverLang = null;
    let receiver = null;

    for (let room in client.rooms) {
      if (room !== client.id) {
        receiver = room.replace(client.id, "");
      }
    }
    console.log(receiver);

    users.forEach(user => { // finding sender's language
      if (client.id === user.id) {
        senderLang = user.lang;
      }
      else if (receiver === user.id) {
        receiverLang = user.lang;
      }
    });
    console.log(senderLang);
    console.log(receiverLang);
    io.to(client.id).emit('chat', chat);
    if (receiverLang !== senderLang) {
      translate(chat.message, receiverLang, senderLang, (translation) => {
        chat.message = translation[0].translatedText;
        console.log(chat.message);
        for (let room in client.rooms) {
          if (room !== client.id) {
            io.to(receiver).emit('chat', chat);
          }
        }
      });
    }
    else {
      //Send the chat to everyone in the room
      for (let room in client.rooms) {
        if (room !== client.id) {
          io.to(receiver).emit('chat', chat);
        }
      }
    }
  });

  // Call another user
  client.on('call', call => {
    console.log(call);
    console.log("calling user pt2");
    // Connect both to and from id's to a room (unique room id)
    client.join(call.to + call.from);
    io.to(call.to).emit("call", call);
  });

  // Leave call
  client.on('hangup', () => {
    for (let room in client.rooms) {
      if (client.id !== room) {
        console.log(room);
        io.to(room).emit('hangup');
        io.of('/').in(room).clients((err, clients) => {
          if (err) throw err;
          clients.forEach(id => {
            io.sockets.sockets[id].leave(room);
          });
        });
      }
    }
  });


  client.on('answeredCall', call => {
    client.join(call.to + call.from);
    io.to(call.to).emit('answeredCall', call);
    io.to(call.from).emit('answeredCall', call);
  });

  client.on('declinedCall', call => {
    client.leave(call.to + call.from);
    io.to(call.from).emit('declinedCall', call);
  });

  /* WebRTC signalling */

  // Got offer from peer
  client.on('offer', data => {
    console.log(data);
    io.to(data.to).emit('offer', data);
  });

  // Got answer from peer
  client.on('answer', data => {
    console.log(data);
    io.to(data.from).emit('answer', data);
  });
});

io.listen(3001);
console.log('Listening on port 3001.');