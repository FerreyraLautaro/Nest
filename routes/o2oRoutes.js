const o2oPedidos = require('../models/o2oRel');

module.exports = function(app){


  app.get('/relation_order/:database', (req, res) => {

    var datab = {
    
      database: req.params.database

    };
  
  o2oPedidos.geto2o(datab, (err, data) => {
      res.status(200).json(data);
    });

  });


  app.post('/relation_order', (req, res) => {
    var orderData = {
      origin_id: req.body.origin_id,
      destination_id: req.body.destination_id,
      accomplished: req.body.accomplished,
      date_add: req.body.date_add,
      date_upd: req.body.date_upd,
      database: req.body.database_name
    };
    o2oPedidos.inserto2o(orderData, (err, data) => {
      if (data) {
        //console.log(data);
        res.status(200).json({
          success: true,
          msg: "Inserted a new o2o",
          data: data
        });
        // res.redirect('/users/' + data.insertId);
      } else {
        res.status(500).json({
          success: false,
          msg: "Error"
        });
      }
    });
    });


  
  app.get('/relation_exist/:database&:origin_id', (req, res) => {

      var data = {
      
        database: req.params.database,
        origin_id: req.params.origin_id

      };
    
    o2oPedidos.getOrder(data, (err, data) => {
        res.status(200).json(data);
    });

  });



}