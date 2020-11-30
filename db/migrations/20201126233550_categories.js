
exports.up = function(knex) {
    return knex.schema.createTable('categories', function(table) {
        table.string('flx_id').notNullable();
        table.string('woo_id').notNullable();
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('categories');
};
