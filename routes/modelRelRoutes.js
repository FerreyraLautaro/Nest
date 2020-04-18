const ModelRel = require('../models/modelsRel');

module.exports = function(app){


	app.get('/modelrel', (req, res) => {
	
	ModelRel.getModel((err, data) => {
      res.status(200).json(data);
    });

	});

	app.post('/modelrel', (req, res) => {
    var modelData = {
      id: null,
      name: req.body.name,
      last_success_sync: req.body.last_success_sync   
    };
    ModelRel.insertModel(modelData, (err, data) => {
      if (data && data.insertId) {
      	console.log(data);
        res.status(200).json({
          success: true,
          msg: "Inserted a new ModelRel",
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


	app.put('/modelrel/:id', (req, res) => {
    const modelData = {
      id: req.params.id,
      name: req.body.name,
      last_success_sync: req.body.last_success_sync
    };
    ModelRel.updateModel(modelData, function (err, data) {
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

	app.delete('/modelrel/:id', (req, res) => {
    var id = req.params.id;
    ModelRel.deleteModel(id, (err, data) =>  {
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