const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
const uuidv4 = require('uuid/v4');
const getColor = require('randomcolor');

const rando = () => {
  return Math.floor(Math.random() * 5);
}

// Tmp mem to record assigned colors.
const usedColors = [];
// Helper to generate a unique color.
const uniqueColor = () => {
  let newColor = getColor();
  while (usedColors.includes(newColor)) {
    newColor = getColor();
  }
  return newColor;
}
// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${PORT}`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

  // New user detected
  // Generate and send a random color for each new client.
  const color = uniqueColor();
  usedColors.push(color);
  ws.send(color);
  // broadcast user count
  wss.clients.forEach(client => {
    if (client.readyState) {
      console.log(wss.clients.size);
      client.send(`${wss.clients.size}`);
    }
  })

  // Handling incoming messages.
  ws.on('message', data => {
    const message = JSON.parse(data);
    if (message.type === 'postMessage') {
      console.log(`User ${message.username} said ${message.content}`, usedColors)
      message.id = uuidv4();
      message.type = 'incomingMessage';
    } else if (message.type === 'postNotification') {
      message.id = uuidv4();
      message.type = 'incomingNotification';
    }

    // Broadcasts recieved message
    wss.clients.forEach(client => {
      if (client.readyState) {
        client.send(JSON.stringify(message));
      }
    })
  })
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    // Remove user color from used
    usedColors.splice(usedColors.indexOf(color), 1);
    // Broadcast new user count
    wss.clients.forEach(client => {
      if (client.readyState) {
        client.send(`${wss.clients.size}`);
      }
    })
  })
});