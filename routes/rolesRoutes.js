const Roles = require('../models/roles');

module.exports = function(app){


	app.get('/roles', (req, res) => {
	
	Roles.getRoles((err, data) => {
      res.status(200).json(data);
    });

	});

	app.post('/roles', (req, res) => {
    var rolData = {
      id: null,
      name: req.body.name,
      type: req.body.type      
    };
    Roles.insertRoles(rolData, (err, data) => {
      if (data && data.insertId) {
      	console.log(data);
        res.status(200).json({
          success: true,
          msg: "Inserted a new rol",
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


	app.put('/roles/:id', (req, res) => {
    const rolData = {
      id: req.params.id,
      name: req.body.name,
      type: req.body.type
    };
    Roles.updateRol(rolData, function (err, data) {
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

	app.delete('/roles/:id', (req, res) => {
    var id = req.params.id;
    Roles.deleteRol(id, (err, data) =>  {
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















