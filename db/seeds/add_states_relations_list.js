
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('states').del()
    .then(function () {
      // Inserts seed entries
      return knex('states').insert([
        {woo_id: 'C', flx_id: '001'}, // Ciudad Autónoma de Buenos Aires
        {woo_id: 'B', flx_id: '002'}, // Buenos Aires
        {woo_id: 'K', flx_id: '004'}, // Catamarca
        {woo_id: 'H', flx_id: '005'}, // Chaco
        {woo_id: 'U', flx_id: '006'}, // Chubut
        {woo_id: 'X', flx_id: '003'}, // Córdoba
        {woo_id: 'W', flx_id: '007'}, // Corrientes
        {woo_id: 'E', flx_id: '008'}, // Entre Ríos
        {woo_id: 'P', flx_id: '009'}, // Formosa
        {woo_id: 'Y', flx_id: '013'}, // Jujuy
        {woo_id: 'L', flx_id: '014'}, // La Pampa
        {woo_id: 'F', flx_id: '015'}, // La Rioja
        {woo_id: 'M', flx_id: '016'}, // Mendoza
        {woo_id: 'N', flx_id: '017'}, // Misiones
        {woo_id: 'Q', flx_id: '018'}, // Neuquén
        {woo_id: 'R', flx_id: '019'}, // Río Negro
        {woo_id: 'A', flx_id: '020'}, // Salta
        {woo_id: 'J', flx_id: '021'}, // San Juan
        {woo_id: 'D', flx_id: '022'}, // San Luis
        {woo_id: 'Z', flx_id: '023'}, // Santa Cruz
        {woo_id: 'S', flx_id: '024'}, // Santa Fe
        {woo_id: 'G', flx_id: '025'}, // Santiago del Estero
        {woo_id: 'V', flx_id: '026'}, // Tierra del Fuego
        {woo_id: 'T', flx_id: '024'}, // Tucumán
      ]);
    });
};
