const { Pool } = require("pg")

module.exports = new Pool ({
    user: 'mateeusgl',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'foodfydb'
})