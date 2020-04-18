const Integrations = require('../models/integrations');

module.exports = function(app){


	app.get('/integrations', (req, res) => {
	
	Integrations.get((err, data) => {
      res.status(200).json(data);
    });

	});

	app.post('/integrations', (req, res) => {
    var dataIntegration = {
      id: null,
      origin_service_id: req.body.origin_service_id,
      destination_service_id: req.body.destination_service_id   
    };
    Integrations.insert(dataIntegration, (err, data) => {
      if (data && data.insertId) {
      	console.log(data);
        res.status(200).json({
          success: true,
          msg: "Inserted a new Integration",
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


	app.put('/integrations/:id', (req, res) => {
    const dataIntegration = {
      id: req.params.id,
      origin_service_id: req.body.origin_service_id,
      destination_service_id: req.body.destination_service_id
    };
    Integrations.update(dataIntegration, function (err, data) {
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

	app.delete('/integrations/:id', (req, res) => {
    var id = req.params.id;
    Integrations.deleteIntegration(id, (err, data) =>  {
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