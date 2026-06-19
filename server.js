const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

wss.on('connection', (ws) => {
    console.log('User connected');
    
    ws.on('message', (message) => {
        try {
            // Parse incoming JSON action protocol safely
            const data = JSON.parse(message.toString());
            
            // Broadcast the exact action payload (send, edit, or unsend) to all active users
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        } catch (e) {
            console.error("Invalid frame payload received");
        }
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server running dynamically');
});
