const Request = require('request');


module.exports = function(app){



	//busqueda de warehouses
	app.get('/warehouses/ip_api=:ip_api&ver=:ver&port=:port&token=:token', (req, res) => {
      
      var query = {
        ip_api: req.params.ip_api,
        ver: req.params.ver,
        port: req.params.port,
        token: req.params.token
        };

      var address = query.ip_api;
      if(query.port !='null'){
      	address = query.ip_api+':'+query.port;
      }

      const options = {
        url: 'http://'+address+'/'+query.ver+'/warehouses',
          headers: {
            'Authorization': 'Bearer '+query.token
          }
      };

      console.log('http://'+address+'/'+query.ver+'/warehouses');
         
      function callback(error, response, body) {
	        if (!error && response.statusCode == 200) {
	        
	        console.log("status 200 ok");

	        let resp = JSON.parse(body);
	        
	        res.status(200).json({
	                    error: false,
	                    message: "success",
	                    Warehouses: resp.Warehouses
	                    });
	        }
		    else{
		    	console.log("status 500 false");
		      	//let resp = JSON.parse(body);
		        res.status(404).json({
		                    success: false,
		                    msg: "Error"
		                    });
		    }
	   }

    	Request(options, callback);

    }); 







}