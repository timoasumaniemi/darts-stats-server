require('dotenv').config();
const mysql = require('mysql2/promise');

const conf = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dateStrings: false,
    timezone: '+00:00'
}

const db_pool = mysql.createPool(conf);

module.exports = db_pool;

