import {createServer} from 'https';
import {WebSocketServer, WebSocket} from 'ws';
import {readFileSync} from 'fs'

let grid = createGrid()

const port = 3000
const server = createServer({
        key: readFileSync("ssl/privkey.pem"),
        cert: readFileSync("ssl/fullchain.pem"),
    },
    (req, res) => {
        res.writeHead(200);
        res.end('This is the Grid Paint API');
    });
const wss = new WebSocketServer({server});

server.listen(port)

wss.on('connection', ws => {
    ws.isAlive = true;

    ws.on('message', message => {
        const {type, data} = JSON.parse(message)

        if (type === "update") {
            grid[data.x][data.y] = data.value
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({type: "update", data: data}));
                }
            });
        } else if (type === "pong") {
            ws.isAlive = true
        }
    });

    ws.send(JSON.stringify({type: "init", data: grid}));

    wss.clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({type: "active_users", data: wss.clients.size}));
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
        ws.send(JSON.stringify({type: "ping"}));
    });

    wss.clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({type: "active_users", data: wss.clients.size}));
        }
    });
}, 4000);

wss.on('close', () => {
    clearInterval(interval);
});

function createGrid() {
    let grid = []
    let first_array = []
    const [x_dims, y_dims] = [96, 54] // 96x54

    for (let y = 0; y < y_dims; y++) {
        first_array.push(false)
    }

    for (let x = 0; x < x_dims; x++) {
        grid.push([...first_array])
    }

    return grid
}
