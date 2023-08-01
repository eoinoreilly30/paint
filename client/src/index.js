import {getAnalytics} from "firebase/analytics";
import {initializeApp} from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyAMnUKklg2ofkmZwFeRLb-pJ5wY2vbstA8",
    authDomain: "paint-eab6a.firebaseapp.com",
    projectId: "paint-eab6a",
    storageBucket: "paint-eab6a.appspot.com",
    messagingSenderId: "163173252961",
    appId: "1:163173252961:web:aac45d6b3f112401344f20",
    measurementId: "G-VK02Q2RWQJ"
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

let coord = {x: 0, y: 0}

canvas.addEventListener("mousedown", event => {
    canvas.addEventListener('mousemove', draw);
    reposition(event)
});
canvas.addEventListener("mouseup", () => {
    canvas.removeEventListener('mousemove', draw);
    socket.send(JSON.stringify({type: "update", data: canvas.toDataURL("image/webp", 1)}))
});

canvas.addEventListener("touchstart", event => {
    console.log(event);
    canvas.addEventListener('touchmove', draw);
    reposition(event)
});
canvas.addEventListener("touchend", () => {
    canvas.removeEventListener('touchmove', draw);
    socket.send(JSON.stringify({type: "update", data: canvas.toDataURL("image/webp", 1)}))
});

function draw(event) {
    context.beginPath();
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = '#ACD3ED';
    context.moveTo(coord.x, coord.y);
    reposition(event);
    context.lineTo(coord.x, coord.y);
    context.stroke();
}

function reposition(event) {
    let clientX = event.type === "touchmove" || event.type === "touchstart" ? event.touches[0].clientX : event.clientX
    let clientY = event.type === "touchmove" || event.type === "touchstart" ? event.touches[0].clientY : event.clientY
    coord.x = clientX - canvas.offsetLeft;
    coord.y = clientY - canvas.offsetTop;
}

socket.addEventListener("message", event => {
    const {type, data} = JSON.parse(event.data)

    if (type === "init" || type === "update") {
        let image = new Image();
        image.onload = () => {
            context.drawImage(image, 0, 0, width, height);
        };
        image.src = data;

    } else if (type === "clear") {
        context.clearRect(0, 0, width, height)

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

document.getElementById("clear-button").addEventListener("click", () => {
    context.clearRect(0, 0, width, height)
    socket.send(JSON.stringify({type: "clear"}))
})
