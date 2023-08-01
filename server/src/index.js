import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';

let canvas = ""

const port = 3000
const server = createServer({
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
