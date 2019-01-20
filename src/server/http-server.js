const express = require('express');
const dotenv = require('dotenv').config();
var cookieParser = require('cookie-parser');
const app = express();
const HTTP_PORT = process.env.HTTP_SERVER_PORT;

// POST body parser
let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: false})); // support encoded bodies
// Cookie parser
app.use(cookieParser());

app.use(express.static('dist'));

app.post('/api/register', (req, res) => {
    if (req.body.username === undefined) {
        res.send({error: true});
    } else {
        res.cookie('username', req.body.username)
    }
    res.send({error: false});
});

app.post('/api/is_auth', (req, res) => {
    let is_auth = req.cookies.username !== undefined && req.cookies.username !== '';
    res.send({is_auth: is_auth, username: req.cookies.username});
});

app.post('/api/logout', (req, res) => {
    let oldUsername = req.cookies.username;
    res.clearCookie('username');
    res.send({error: false, username: oldUsername});
});

app.listen(HTTP_PORT, function () {
    console.log("HTTP server listening on port " + HTTP_PORT)
}).on("error", (err) => {
    console.log(err);
});