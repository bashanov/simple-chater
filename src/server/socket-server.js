const server = require('http').createServer();
const io = require("socket.io")(server);
const dotenv = require('dotenv').config();
const cookie = require('cookie');
const SOCKET_PORT = process.env.SOCKET_SERVER_PORT;

let members = new Map();
let online = 0;
let messagesPool = [];

function log(msg) {
    console.log("[" + (new Date()) + "] " + msg);
}

function createPdu(type, data) {
    data.type = type;
    data.time = (new Date()).toLocaleTimeString([], {hour12: false});
    return data;
}

io.on("connection", (socket) => {
    socket.data = {};
    // New member connected
    log("Connected " + socket.id);

    // Chat history
    messagesPool.map((pdu) => {
        socket.emit("pdu", pdu);
    });

    let visitorCookies = {};
    if (socket.request.headers.cookie !== undefined && typeof socket.request.headers.cookie === 'string') {
        visitorCookies = cookie.parse(socket.request.headers.cookie);
    }
    if (visitorCookies.username !== undefined) {
        log(socket.id + " = " + visitorCookies.username);
        members.set(socket.id, socket);
        socket.data.is_auth = true;
        io.emit("pdu", createPdu("info", {message: "User \u00ab" + visitorCookies.username + "\u00bb join the chat \ud83e\udd18\ud83c\udffe"}));
    } else {
        socket.data.is_auth = false;
    }
    online++;
    io.emit("pdu", createPdu("service", {online: online}));

    // Member disconnected
    socket.on("disconnect", () => {
        log("Gone: " + socket.id);
        online--;
        io.emit("pdu", createPdu("service", {online: online}));
        members.delete(socket.id);
    });

    // Send pdu to all
    socket.on("sendPdu", (pdu) => {
        log('New PDU');
        messagesPool.push(pdu);
        if (messagesPool.length > 50) {
            messagesPool.shift();
        }
        io.emit("pdu", createPdu("message", pdu));
    });

    socket.on("logout", (username) => {
        io.emit("pdu", createPdu("info", {message: "User \u00ab" + username + "\u00bb left the chat \ud83c\udfc3\ud83c\udffe"}));
    });

    socket.on("login", (username) => {
        io.emit("pdu", createPdu("info", {message: "User \u00ab" + username + "\u00bb join the chat \ud83e\udd18\ud83c\udffe"}));
    })

});

server.listen(SOCKET_PORT, function () {
    console.log("Socket server listening on port " + SOCKET_PORT)
});