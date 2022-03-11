import {getAnalytics} from "firebase/analytics";
import {initializeApp} from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyDGpTKnFjLJOM1n2_eY6AgBLY1nmDkq8ho",
    authDomain: "grid-paint-e3dbf.firebaseapp.com",
    projectId: "grid-paint-e3dbf",
    storageBucket: "grid-paint-e3dbf.appspot.com",
    messagingSenderId: "861793848325",
    appId: "1:861793848325:web:966094687dffbbd003606c",
    measurementId: "G-1FS1MRB4S0"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

if (module.hot) module.hot.accept()

const PORT = 3000
const SERVER = process.env.NODE_ENV === "development" ? "localhost" : "api.0x30.in"
let socket = new WebSocket(`wss://${SERVER}:${PORT}`);

socket.addEventListener("error", () => {
    document.getElementById("api-error").style.display = "block"
})

socket.addEventListener("open", heartbeat)

let pingTimeout = null

socket.addEventListener('close', () => {
    clearTimeout(pingTimeout);
    setTimeout(() => {
        document.getElementById("api-error").style.display = "block"
    }, 2000)
});

function heartbeat() {
    clearTimeout(pingTimeout);
    pingTimeout = setTimeout(() => {
        socket.close();
    }, 4000 + 1000);
}

window.onbeforeunload = () => {
    socket.close()
}

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

const width = window.innerWidth
const height = window.innerHeight
canvas.width = width
canvas.height = height

window.addEventListener('resize', () => {
    location.reload()
})

let grid = []
let x_increment = 0
let y_increment = 0

socket.addEventListener("message", event => {
    const {type, data} = JSON.parse(event.data)

    if (type === "init") {
        grid = data
        x_increment = width / grid.length
        y_increment = height / grid[0].length

        canvas.addEventListener("click", event => {
            let x = Math.floor(event.clientX / x_increment)
            let y = Math.floor(event.clientY / y_increment)

            if (grid[x][y]) {
                grid[x][y] = false
                context.clearRect(x * x_increment, y * y_increment, x_increment, y_increment)
                socket.send(JSON.stringify({type: "update", data: {x: x, y: y, value: false}}))
            } else {
                grid[x][y] = true
                context.fillRect(x * x_increment, y * y_increment, x_increment, y_increment)
                socket.send(JSON.stringify({type: "update", data: {x: x, y: y, value: true}}))
            }
        })

        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[0].length; y++) {
                if (grid[x][y]) {
                    context.fillRect(x * x_increment, y * y_increment, x_increment, y_increment)
                }
            }
        }

    } else if (type === "update") {
        const {x, y, value} = data
        if (value) {
            grid[x][y] = true
            context.fillRect(x * x_increment, y * y_increment, x_increment, y_increment)
        } else {
            grid[x][y] = false
            context.clearRect(x * x_increment, y * y_increment, x_increment, y_increment)
        }
    } else if (type === "active_users") {
        if (data > 1) {
            document.getElementById("active-users-on").style.display = "block"
            document.getElementById("active-users-off").style.display = "none"
        } else {
            document.getElementById("active-users-on").style.display = "none"
            document.getElementById("active-users-off").style.display = "block"
        }
        document.getElementById("active-users-text").innerText = `${data - 1} other ${data === 2 ? 'user' : 'users'}`

    } else if (type === "ping") {
        heartbeat()
        socket.send(JSON.stringify({type: "pong"}))
    }
});
