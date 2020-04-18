const Companies = require('../models/companies');

module.exports = function(app){


	app.get('/companies', (req, res) => {
	
	Companies.getCompanies((err, data) => {
      res.status(200).json(data);
    });

	});

	app.post('/companies', (req, res) => {
    var dataCompany = {
      id: null,
      name: req.body.name,
      cnn_relation_db: req.body.cnn_relation_db   
    };
    Companies.insertCompanies(dataCompany, (err, data) => {
      if (data && data.insertId) {
      	console.log(data);
        res.status(200).json({
          success: true,
          msg: "Inserted a new Company",
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


	app.put('/companies/:id', (req, res) => {
    const dataCompany = {
      id: req.params.id,
      name: req.body.name,
      cnn_relation_db: req.body.cnn_relation_db
    };
    Companies.updateCompanies(dataCompany, function (err, data) {
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

	app.delete('/companies/:id', (req, res) => {
    var id = req.params.id;
    Companies.deleteCompany(id, (err, data) =>  {
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