
exports.up = function(knex) {
    return knex.schema.createTable('states', function(table) {
        table.string('flx_id').notNullable();
        table.string('woo_id').notNullable();
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('states');
};


// Requiere execute seeding add_states_relations_list
// {C: 001}, // Ciudad Autónoma de Buenos Aires
// {B: 002}, // Buenos Aires
// {K: 004}, // Catamarca
// {H: 005}, // Chaco
// {U: 006}, // Chubut
// {X: 003}, // Córdoba
// {W: 007}, // Corrientes
// {E: 008}, // Entre Ríos
// {P: 009}, // Formosa
// {Y: 013}, // Jujuy
// {L: 014}, // La Pampa
// {F: 015}, // La Rioja
// {M: 016}, // Mendoza
// {N: 017}, // Misiones
// {Q: 018}, // Neuquén
// {R: 019}, // Río Negro
// {A: 020}, // Salta
// {J: 021}, // San Juan
// {D: 022}, // San Luis
// {Z: 023}, // Santa Cruz
// {S: 024}, // Santa Fe
// {G: 025}, // Santiago del Estero
// {V: 026}, // Tierra del Fuego
// {T: 024}, // Tucumán