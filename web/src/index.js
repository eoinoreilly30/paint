const axios = require('axios');

if (module.hot) module.hot.accept()

const DEBUG = false
const BASE_URL = "http://localhost:3000"

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

// TODO: screen size change listener

const width = window.innerWidth
const height = window.innerHeight

canvas.width = width
canvas.height = height

let bitmap = []
let x_dims = 0
let y_dims = 0
let x_increment = 0
let y_increment = 0

getGrid()

canvas.addEventListener("click", event => {
    let x = Math.floor(event.clientX / x_increment)
    let y = Math.floor(event.clientY / y_increment)

    if (bitmap[x][y]) {
        bitmap[x][y] = false
        context.clearRect(x * x_increment, y * y_increment, x_increment, y_increment)
    } else {
        bitmap[x][y] = true
        context.fillRect(x * x_increment, y * y_increment, x_increment, y_increment)
    }
})

function getGrid() {
    axios.get(BASE_URL + '/grid')
        .then((response) => {
            bitmap = response.data
            x_dims = bitmap.length
            y_dims = bitmap[0].length
            x_increment = width / x_dims
            y_increment = height / y_dims
            drawGrid()
        })
        .catch((error) => {
            console.log(error);
        })
}

function drawGrid() {
    for (let x = 0; x < bitmap.length; x++) {
        for (let y = 0; y < bitmap[0].length; y++) {
            if (bitmap[x][y]) {
                context.fillRect(x * x_increment, y * y_increment, x_increment, y_increment)
            }
        }
    }

    if (DEBUG) {
        for (let y = 0; y < y_dims; y++) {
            context.moveTo(0, y * y_increment);
            context.lineTo(width, y * y_increment);
        }

        for (let x = 0; x < x_dims; x++) {
            context.moveTo(x * x_increment, 0);
            context.lineTo(x * x_increment, height);
        }

        context.strokeStyle = "lightgrey";
        context.lineWidth = 1
        context.stroke();
    }
}
