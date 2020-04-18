const Services = require('../models/services');

module.exports = function(app){


	app.get('/services', (req, res) => {
	
	Services.get((err, data) => {
      res.status(200).json(data);
    });

	});

	app.post('/services', (req, res) => {
    var dataService = {
      id: null,
      company_id: req.body.company_id,
      platform_id: req.body.platform_id,
      credential: req.body.credential,
      active: req.body.active,
      date_add: req.body.date_add,
      date_upd: req.body.date_upd
    };
    Services.insert(dataService, (err, data) => {
      if (data && data.insertId) {
      	console.log(data);
        res.status(200).json({
          success: true,
          msg: "Inserted a new Service",
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


	app.put('/services/:id', (req, res) => {
    const dataService = {
      id: req.params.id,
      company_id: req.body.company_id,
      platform_id: req.body.platform_id,
      credential: req.body.credential,
      active: req.body.active,
      date_add: req.body.date_add,
      date_upd: req.body.date_upd
    };
    Services.update(dataService, function (err, data) {
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

	app.delete('/services/:id', (req, res) => {
    var id = req.params.id;
    Services.deleteService(id, (err, data) =>  {
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