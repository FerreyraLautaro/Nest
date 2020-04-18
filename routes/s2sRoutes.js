const s2sprovinces = require('../models/s2sRel');

module.exports = function(app){


  app.get('/relation_provinces/:database', (req, res) => {

    var datab = {
    
      database: req.params.database

    };
  
  s2sprovinces.gets2s(datab, (err, data) => {
      res.status(200).json(data);
    });

  });


  // app.post('/relation_clients', (req, res) => {
  //   var orderData = {
  //     origin_id: req.body.origin_id,
  //     destination_id: req.body.destination_id,
  //     accomplished: req.body.accomplished,
  //     date_add: req.body.date_add,
  //     date_upd: req.body.date_upd,
  //     database: req.body.database_name
  //   };
  //   s2sprovinces.inserto2o(orderData, (err, data) => {
  //     if (data) {
  //       //console.log(data);
  //       res.status(200).json({
  //         success: true,
  //         msg: "Inserto un nuevo cliente",
  //         id_cliente: data.insertId
  //       });
  //       // res.redirect('/users/' + data.insertId);
  //     } else {
  //       res.status(500).json({
  //         success: false,
  //         msg: "Error"
  //       });
  //     }
  //   });
  //   });


  
  app.get('/province_exist/:database&:origin_id', (req, res) => {

      var data = {
      
        database: req.params.database,
        origin_id: req.params.origin_id

      };
    
    s2sprovinces.getProvince(data, (err, data) => {
        res.status(200).json(data);
    });

  });


  // app.put('/client', (req, res) => {
  //   const clientParameter = {
  //     id: req.body.id,
  //     destination_id: req.body.destination_id,
  //     accomplished: req.body.accomplished,
  //     database: req.body.database_name   
  //   };
  //   s2sprovinces.updateClient(clientParameter, function (err, data) {
  //     if (data && data.msg) {
  //       res.status(200).json({data});
  //     } else {
  //       res.status(500).json({
  //         success: false,
  //         msg: 'Error'
  //       });
  //     }
  //   });
  //   });




}