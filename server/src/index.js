import { createServer } from 'https';
import { WebSocket, WebSocketServer } from 'ws';
import { readFileSync } from 'fs'

let canvas = ""

const port = 80
const server = createServer({
    // key: readFileSync("/home/eoin/ssl/privkey.pem"),
    // cert: readFileSync("/home/eoin/ssl/fullchain.pem"),
},
    (req, res) => {
        res.writeHead(200);
        res.end('This is the Paint API');
    });
const wss = new WebSocketServer({ server });

server.listen(port)
console.log(`Server started! Listening on port ${port}`)

wss.on('connection', ws => {
    ws.isAlive = true;

    ws.on('message', message => {
        const { type, data } = JSON.parse(message)

        if (type === "update") {
            canvas = data
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "update", data: data }));
                }
            });

        } else if (type === "clear") {
            canvas = ""
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "clear" }));
                }
            });
        } else if (type === "pong") {
            ws.isAlive = true
        }
    });

    ws.send(JSON.stringify({ type: "init", data: canvas }));

    wss.clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "active_users", data: wss.clients.size }));
        }
    });
});

const interval = setInterval(() => {
    wss.clients.forEach(ws => {
        if (!ws.isAlive) {
            ws.terminate();
            return
        }
        ws.isAlive = false;
        ws.send(JSON.stringify({ type: "ping" }));
    });

    wss.clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "active_users", data: wss.clients.size }));
        }
    });
}, 4000);

wss.on('close', () => {
    clearInterval(interval);
});
