const ModelRelationRel = require('../models/relationsRel');

module.exports = function(app){


	app.get('/relationrel/:database', (req, res) => {

    var datab = {
    
      database: req.params.database

    };
	
	ModelRelationRel.getRelation(datab, (err, data) => {
      res.status(200).json(data);
    });

	});



  app.get('/originrelation/:id&:database', (req, res) => {
    
     var id = {
      id: req.params.id,
      database: req.params.database
    };
    
  ModelRelationRel.getOriginID(id, (err, data) => {
      if (data) {
        res.status(200).json({data});
      } else {
        res.status(500).json({
          success: false,
          msg: 'Error'
        });
      }
    });
    }); 


  app.get('/destination/:destination_id&:database', (req, res) => {
    
     var destination_id = {
      destination_id: req.params.destination_id,
      database: req.params.database
    };
    
  ModelRelationRel.getDestinationID(destination_id, (err, data) => {
      if (data) {
        res.status(200).json({data});
      } else {
        res.status(500).json({
          success: false,
          msg: 'Error'
        });
      }
    });
    }); 

  app.get('/searchinorigin/:destination_id&:integration_id&:database', (req, res) => {
    
     var datos = {
      integration_id: req.params.integration_id,
      destination_id: req.params.destination_id,
      database: req.params.database
    };
  
  ModelRelationRel.getSearchOriginID(datos, (err, data) => {
      if (data) {
        res.status(200).json({data});
      } else {
        res.status(500).json({
          success: false,
          msg: 'Error'
        });
      }
    });
    }); 



	app.post('/relationrel', (req, res) => {
    var relationData = {
      id: null,
      date_add: req.body.date_add,
      date_upd: req.body.date_upd,
      destination_id: req.body.destination_id,
      integration_id: req.body.integration_id,
      model_id: req.body.model_id,
      origin_id: req.body.origin_id,
      database: req.body.database
    };
    console.log(relationData);
    
    ModelRelationRel.insertRelation(relationData, (err, data) => {
      if (data) {
      	console.log(data);
        let resp = JSON.parse(JSON.stringify(data))
        //console.log(resp[0].id);
        res.status(200).json({
          id: resp[0].id
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


	app.put('/relationrel/:id', (req, res) => {
    const relationData = {
      id: req.params.id,
      date_add: req.body.date_add,
      date_upd: req.body.date_upd,
      destination_id: req.body.destination_id,
      integration_id: req.body.integration_id,
      model_id: req.body.model_id,
      origin_id: req.body.origin_id,
      database: req.body.database
    };
    ModelRelationRel.updateRelation(relationData, function (err, data) {
      if (data && data.msg) {
        res.status(200).json({data});
      } else {
        res.status(500).json({
          success: false,
          msg: 'Error'
        });
      }
    });
  	});

	app.delete('/relationrel/:id&:database', (req, res) => {
    var id = {
      id: req.params.id,
      database: req.params.database
    };
    ModelRelationRel.deleteRelation(id, (err, data) =>  {
      if (data && data.msg === 'deleted' || data.msg == 'not Exists') {
        res.json({
          success: 'true',
          data
        });
      } else {
        res.status(500).json({
          msg: 'Error'
        });
      }
    });
  	});

	}