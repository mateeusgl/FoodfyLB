const { Pool } = require("pg")

module.exports = new Pool ({
    user: 'mateeusgl',
    password: 'mateus',
    host: 'localhost',
    port: 5432,
    database: 'foodfylb'
})