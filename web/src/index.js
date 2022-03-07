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

let grid = []
let x_dims = 0
let y_dims = 0
let x_increment = 0
let y_increment = 0

axios.get(BASE_URL + '/grid')
    .then(({data}) => {
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
                updateBitmap(x, y)
            } else {
                grid[x][y] = true
                context.fillRect(x * x_increment, y * y_increment, x_increment, y_increment)
                updateBitmap(x, y)
            }
        })

        drawGrid()
    })
    .catch((error) => {
        console.log(error);
    })

function drawGrid() {
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[0].length; y++) {
            if (grid[x][y]) {
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

function updateBitmap(x, y) {
    axios.post(BASE_URL + '/grid', {x: x, y: y})
        .catch(err => {
            console.log(err);
        })
}
