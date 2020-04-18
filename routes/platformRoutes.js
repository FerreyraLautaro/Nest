const Platforms = require('../models/platforms');

module.exports = function(app){


	app.get('/platforms', (req, res) => {
	
	Platforms.getPlatforms((err, data) => {
      res.status(200).json(data);
    });

	});

	app.post('/platforms', (req, res) => {
    var platformData = {
      id: null,
      name: req.body.name,
      credential_template: req.body.credential_template      
    };
    Platforms.insertPlatforms(platformData, (err, data) => {
      if (data && data.insertId) {
      	console.log(data);
        res.status(200).json({
          success: true,
          msg: "Inserted a new Platform",
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


	app.put('/platforms/:id', (req, res) => {
    const platformData = {
      id: req.params.id,
      name: req.body.name,
      credential_template: req.body.credential_template
    };
    Platforms.updatePlatforms(platformData, function (err, data) {
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

	app.delete('/platforms/:id', (req, res) => {
    var id = req.params.id;
    Platforms.deletePlatform(id, (err, data) =>  {
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