
exports.up = function(knex) {
    return knex.schema.createTable('payment_methods', function(table) {
        table.string('flx_id').notNullable();
        table.string('woo_id').notNullable();
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('payment_methods');
};


// Requiere execute seeding add_payment_methods_relations_list
