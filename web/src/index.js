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
const SERVER = process.env.NODE_ENV === "development" ? "localhost" : "chatmaps-api.0x30.in"
const socket = new WebSocket(`wss://${SERVER}:${PORT}`);

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

// TODO: screen size change listener

const width = window.innerWidth
const height = window.innerHeight

canvas.width = width
canvas.height = height

let grid = []
let x_dims = 0
let y_dims = 0
let x_increment = 0
let y_increment = 0

socket.addEventListener('message', event => {
    const {type, data} = JSON.parse(event.data)

    if (type === "init") {
        grid = data
        x_dims = grid.length
        y_dims = grid[0].length
        x_increment = width / x_dims
        y_increment = height / y_dims

        canvas.addEventListener("click", event => {
            let x = Math.floor(event.clientX / x_increment)
            let y = Math.floor(event.clientY / y_increment)

            if (grid[x][y]) {
                grid[x][y] = false
                context.clearRect(x * x_increment, y * y_increment, x_increment, y_increment)
                socket.send(JSON.stringify({x: x, y: y, value: false}))
            } else {
                grid[x][y] = true
                context.fillRect(x * x_increment, y * y_increment, x_increment, y_increment)
                socket.send(JSON.stringify({x: x, y: y, value: true}))
            }
        })

        drawGrid()
    } else if (type === "update") {
        const {x, y, value} = data
        if (value) {
            grid[x][y] = true
            context.fillRect(x * x_increment, y * y_increment, x_increment, y_increment)
        } else {
            grid[x][y] = false
            context.clearRect(x * x_increment, y * y_increment, x_increment, y_increment)
        }
    }
});

function drawGrid() {
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[0].length; y++) {
            if (grid[x][y]) {
                context.fillRect(x * x_increment, y * y_increment, x_increment, y_increment)
            }
        }
    }
}
