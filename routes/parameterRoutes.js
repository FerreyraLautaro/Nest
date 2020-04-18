const Parameters = require('../models/parameters');

module.exports = function(app){


	app.get('/parameters', (req, res) => {
	
	Parameters.get((err, data) => {
      res.status(200).json(data);
    });

	});


  app.get('/paramsbyid/:id', (req, res) => {
    
  var id = req.params.id
    
  Parameters.getparamsID(id, (err, data) => {
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


  app.get('/paramsbyidname/:id&:name', (req, res) => {
    
     var idd = {
      id: req.params.id,
      name: req.params.name
    };
    
  Parameters.getparamsIdName(idd, (err, data) => {
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





	app.post('/parameters', (req, res) => {
    var dataParameter = {
      id: null,
      service_id: req.body.service_id,
      name: req.body.name,
      value: req.body.value   
    };
    Parameters.insert(dataParameter, (err, data) => {
      if (data) {
        //console.log(data);
        res.status(200).json({
          success: true,
          msg: "Inserted a new Parameter",
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


	app.put('/parameters/:id', (req, res) => {
    const dataParameter = {
      id: req.params.id,
      service_id: req.body.service_id,
      name: req.body.name,
      value: req.body.value   
    };
    Parameters.updateParameter(dataParameter, function (err, data) {
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

	app.delete('/parameters/:id', (req, res) => {
    var id = req.params.id;
    Parameters.deleteParameter(id, (err, data) =>  {
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