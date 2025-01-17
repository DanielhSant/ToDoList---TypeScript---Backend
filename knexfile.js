const { db } = require('./.env')

module.exports = {
    client: 'pg',
    connection: db,
    pool: {
        min: 2,
        max: 10
    },
    migration: {
        tableName: 'knex_migrations'
    } 
}