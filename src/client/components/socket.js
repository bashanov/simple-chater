const io = require("socket.io-client");
const dotenv = require('dotenv').config();

const HOST = process.env.NODE_ENV === "production" ? process.env.HOST : "localhost";
const SOCKET_PORT = process.env.SOCKET_SERVER_PORT;
const socket = io.connect("http://" + HOST + ":" + SOCKET_PORT);

export default () => {

    function listenConnect(handleConnect) {
        socket.on("connect", () => {
            handleConnect(socket.io.engine.id)
        });
    }

    function handlePdu(onPduReceived) {
        socket.on("pdu", onPduReceived)
    }

    function sendPdu(message, username) {
        socket.emit("sendPdu", {message: message, username: username})
    }

    function logOut(callback) {
        console.log('Logging out...');
        fetch('/api/logout', {
            method: 'POST'
        })
            .then(res => res.json())
            .then(res => {
                if (res.error !== undefined && !res.error) {
                    socket.emit("logout", res.username);
                    callback(true);
                }
                callback(false);
            });
    }

    function logIn(username, callback) {
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username})
        })
            .then(res => res.json())
            .then(res => {
                if (res.error !== undefined && !res.error) {
                    console.log("User authorized as " + username + ". Hello!");
                    socket.emit("login", username);
                    callback(true);
                } else {
                    alert('Error: unable to set username');
                    callback(false);
                }
            });
    }

    return {
        handlePdu,
        sendPdu,
        listenConnect,
        logOut,
        logIn
    }
}