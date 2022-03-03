if (module.hot) module.hot.accept()

const DEBUG = false

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

// TODO: screen size change listener

let bitmap = []
let first_array = []

const width = window.innerWidth
const height = window.innerHeight

canvas.width  = width
canvas.height = height

const x_dims = 96
const y_dims = 54
const x_increment = width / x_dims
const y_increment = height / y_dims

for (let y = 0; y < y_dims; y++) {
    if (DEBUG) {
        context.moveTo(0, y*y_increment);
        context.lineTo(width, y*y_increment);
    }
    first_array.push(false)
}

for (let x = 0; x < x_dims; x++) {
    if (DEBUG) {
        context.moveTo(x*x_increment, 0);
        context.lineTo(x*x_increment, height);
    }
    bitmap.push([...first_array])
}

if (DEBUG) {
    context.strokeStyle = "lightgrey";
    context.lineWidth = 1
    context.stroke();
}

canvas.addEventListener("click", event => {
    let x = Math.floor(event.clientX / x_increment)
    let y = Math.floor(event.clientY / y_increment)

    if (bitmap[x][y]) {
        bitmap[x][y] = false
        context.clearRect(x*x_increment, y*y_increment, x_increment, y_increment)
    } else {
        bitmap[x][y] = true
        context.fillRect(x*x_increment, y*y_increment, x_increment, y_increment)
    }
})
