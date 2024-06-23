
exports.up = function(knex) {
    return knex.schema
        .createTable('tasks', function(table) {
            table.increments('id').primary();
            table.string('name',255).notNull();
            table.boolean('done').notNull().defaultTo(false)
            table.integer('userId').references('id')
              .inTable('users').notNull()
        })
}

exports.down = function(knex) {
  return knex.schema.dropTable('tasks')
};
