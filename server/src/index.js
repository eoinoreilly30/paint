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

    console.log('Client connected');

    ws.on('message', message => {
        const { type, data } = JSON.parse(message)

        if (type === "update") {
            console.log('Brushstroke received');
            canvas = data
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "update", data: data }));
                }
            });

        } else if (type === "clear") {
            console.log('Clearing canvas...');
            canvas = ""
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "clear" }));
                }
            });
            console.log('Canvas cleared');
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
}, 3000);

wss.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
});
