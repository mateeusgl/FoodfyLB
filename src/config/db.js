const { Pool } = require("pg")

module.exports = new Pool ({
    user: 'mateeusgl',
    password: 'mateus',
    host: '127.0.0.1',
    port: 5432,
    database: 'foodfylb'
})