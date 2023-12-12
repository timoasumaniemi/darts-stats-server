require('dotenv').config();
const express = require('express');
const cors = require('cors');

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes setup
const playerRoute = require('./routes/player');
app.use('/', playerRoute);

const PORT = process.env.PORT || 3001;

app.listen(PORT, function () {
    console.log('Darts Stats server running. Port: ' + PORT);
});