const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

wss.on('connection', (ws) => {
    console.log('A user joined the group chat!');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            
            // Broadcast the action (send or delete) to everyone connected
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        } catch (e) {
            // Fallback for plain text tracking if any
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'send', id: Date.now(), user: 'Guest', text: message.toString() }));
                }
            });
        }
    });
});

server.listen(3000, () => {
    console.log('🚀 Group-Chat server running locally on http://localhost:3000');
});
