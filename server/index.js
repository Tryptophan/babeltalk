require('dotenv').config();
const io = require('socket.io')({ origins: 'http://localhost:*' });
const uniqid = require('uniqid');
const { translate } = require('./translate');

let langs = new Map();

io.on('connection', (client) => {

  client.on('room', (room) => {
    // Generate unique room id if starting room
    if (!room) {
      let room = uniqid();
      client.join(room);
      io.to(client.id).emit('room', room);
    } else {
      client.join(room);
      io.to(client.id).emit('room', room);
    }
  });

  client.on('lang', (lang) => {
    langs.set(client.id, lang);
  });

  client.on('disconnect', () => {
    langs.delete(client.id);
  });

  // client.on('transcript', transcipt => {
  //   console.log("server transcript");

  //   let senderLang = null;
  //   let receiverLang = null;
  //   let receiver = null;

  //   for (let room in client.rooms) {
  //     if (room !== client.id) {
  //       receiver = room.replace(client.id, "");
  //     }
  //   }

  //   users.forEach(user => { // finding sender's language
  //     if (client.id === user.id) {
  //       senderLang = user.lang;
  //     }
  //     else if (receiver === user.id) {
  //       receiverLang = user.lang;
  //     }
  //   });

  //   if (receiverLang !== senderLang) {
  //     translate(transcipt, receiverLang, senderLang, (translation) => {
  //       transcipt = translation[0].translatedText;
  //       console.log(transcipt);
  //       for (let room in client.rooms) {
  //         if (room !== client.id) {
  //           io.to(receiver).emit('transcript', transcipt);
  //           console.log('EMIT EVENT FIRED FOR TRANSCRIPT');
  //         }
  //       }
  //     });
  //   }
  //   else {
  //     //Send the chat to the receiver in the room
  //     for (let room in client.rooms) {
  //       if (room !== client.id) {
  //         io.to(receiver).emit('transcript', transcipt);
  //       }
  //     }
  //   }
  // });

  // Send chat message
  client.on('chat', chat => {

    // Set the date for the chat message
    chat.key = Date.now();

    // Don't send chat messages with no length
    if (!chat.message.length) return;

    // Language to translate from
    let fromLang = langs.get(client.id);

    // Send to all clients in room
    for (let room in client.rooms) {
      if (room !== client.id) {
        console.log('test');
        // Get all clients in room
        io.of('/').in(room).clients((err, clients) => {
          if (err) throw err;
          clients.forEach(id => {
            // Get the client's language
            let toLang = langs.get(id);
            console.log(toLang);
            // Check if clients have the same language
            if (fromLang !== toLang) {
              // Translate the message
              translate(chat.message, toLang, fromLang, (err, translation) => {
                if (err) throw err;
                // Send translated message to client with different language
                io.to(id).emit('chat', { ...chat, message: translation });
              });
            } else {
              io.to(id).emit('chat', chat);
            }
          });
        });
      }
    }
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