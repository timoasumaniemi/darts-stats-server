require('dotenv').config();
const express = require('express');
const cors = require('cors');

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// Routes setup
const playerRoute = require('./routes/player');
const matchRoute = require('./routes/match');

app.use('/', playerRoute);
app.use('/', matchRoute);

const PORT = process.env.PORT || 3001;

app.listen(PORT, function () {
    console.log('Darts Stats server running. Port: ' + PORT);
});