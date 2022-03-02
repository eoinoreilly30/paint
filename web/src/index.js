if (module.hot) module.hot.accept()

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

// TODO: screen size change listener

// TODO: fix the table at 96x36 blocks, centre in the middle if it doesn't fit

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

let bitmap = []
let first_array = []

for (let y = 0; y < 36; y += 1) {
    context.moveTo(0, y*20);
    context.lineTo(canvas.width, y*20);
    first_array.push(false)
}

for (let x = 0; x < 96; x += 1) {
    context.moveTo(x*20, 0);
    context.lineTo(x, 96*20);
    bitmap.push(first_array)
}

context.strokeStyle = "lightgrey";
context.lineWidth = 1
context.stroke();

canvas.addEventListener("click", event => {
    let x = Math.floor(event.clientX / 20)
    let y = Math.floor(event.clientY / 20)

    if (bitmap[x][y]) {
        context.clearRect(x*20, y*20, 20, 20)

        context.strokeStyle = "lightgrey";
        context.lineWidth = 1
        context.rect(x*20, y*20, 20, 20)

        bitmap[x][y] = false
    } else {
        context.fillRect(x*20, y*20, 20, 20)
        bitmap[x][y] = true
    }
})
