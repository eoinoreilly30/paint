import {createServer} from 'https';
import {WebSocketServer, WebSocket} from 'ws';
import {readFileSync, writeFileSync, existsSync} from 'fs'

createGridIfNotExists()

// TODO: detect broken connections

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
    ws.on('message', data => {
        try {
            data = JSON.parse(data)
            let grid = JSON.parse(readFileSync('grid.txt', 'utf8'))
            grid[data.x][data.y] = data.value
            writeFileSync('grid.txt', JSON.stringify(grid), 'utf8')

            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({type: "update", data: data}));
                }
            });
        } catch (err) {
            console.error(err)
        }
    });

    try {
        const grid = JSON.parse(readFileSync('grid.txt', 'utf8'))
        ws.send(JSON.stringify({type: "init", data: grid}));
    } catch (err) {
        console.error(err)
    }
});

function createGridIfNotExists() {
    try {
        if (!existsSync('grid.txt')) {
            let grid = []
            let first_array = []
            const [x_dims, y_dims] = [4, 2] // 96x54

            for (let y = 0; y < y_dims; y++) {
                first_array.push(false)
            }

            for (let x = 0; x < x_dims; x++) {
                grid.push([...first_array])
            }

            try {
                writeFileSync('grid.txt', JSON.stringify(grid), 'utf8')
            } catch (err) {
                console.error(err)
            }
        }
    } catch (err) {
        console.error(err)
        process.exit()
    }
}
