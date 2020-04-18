const Request = require('request');


module.exports = function(app){

	//listado de productos->cantidad de productos por pagina y paginado
	app.get('/products/warehouse_list=:warehouse_list&limit=:limit&offset=:offset&search=:search&ip_api=:ip_api&ver=:ver&port=:port&token=:token', (req, res) => {
      
      var query = {
      	warehouse_list: req.params.warehouse_list,
        limit: req.params.limit,
        offset: req.params.offset,
        search: req.params.search,
        ip_api: req.params.ip_api,
        ver: req.params.ver,
        port: req.params.port,
        token: req.params.token
        };

      var address = query.ip_api;
      if(query.port != 'null'){
      	address = query.ip_api+':'+query.port;
      }

       
      var options = {
	        url: 'http://'+address+'/'+query.ver+'/products?warehouse_list='+query.warehouse_list+'&limit='+query.limit+'&offset='+query.offset,
	          headers: {
	            'Authorization': 'Bearer '+query.token
	          }
	  };

	  var buscar = query.search;
	  //console.log("buscar: "+buscar);
      
      if(buscar!='null')
      {
	    var options = {
	        url: 'http://'+address+'/'+query.ver+'/products?warehouse_list='+query.warehouse_list+'&limit='+query.limit+'&offset='+query.offset+'&search='+query.search,
	          headers: {
	            'Authorization': 'Bearer '+query.token
	          }
	      };
  	  }
  	  
      //console.log(options);
      //console.log('http://'+address+'/'+query.ver+'/products?warehouse_list='+query.warehouse_list+'&limit='+query.limit+'&offset='+query.offset+'&search='+query.search);
      function callback(error, response, body) {
	       if (!error && response.statusCode == 200) {
	        
	        let resp = JSON.parse(body);

	        if(typeof resp.Products === "undefined" ){
			var productos = resp.data;
			//console.log("usa data");
			}
			else{
				var productos = resp.Products;
				//console.log("usa resp.Products");
			}
	        
	        res.status(200).json({
	                    error: false,
	                    message: "success",
	                    Products:productos
	                    });
		   }
		   else{
		      	//let resp = JSON.parse(body);
		        res.status(404).json({
		                    success: false,
		                    msg: "Error"
		                    });
		      }
	   }

    	Request(options, callback);

    }); 

	
	//busqueda de cantidad de productos(para el paginado)
	app.get('/products/count/search=:search&ip_api=:ip_api&ver=:ver&port=:port&token=:token', (req, res) => {
      
      var query = {
        search: req.params.search,
        ip_api: req.params.ip_api,
        ver: req.params.ver,
        port: req.params.port,
        token: req.params.token
        };

      var address = query.ip_api;
      if(query.port != ''){
      	address = query.ip_api+':'+query.port;
      }

      const options = {
        url: 'http://'+address+'/'+query.ver+'/products/count?search='+query.search,
          headers: {
            'Authorization': 'Bearer '+query.token
          }
      };
      
      function callback(error, response, body) {
	       if (!error && response.statusCode == 200) {
	        
	        let resp = JSON.parse(body);
        
	        res.status(200).json({
	                    error: false,
	                    message: "success",
	                    totalcount: resp.totalcount
	                    });
	        }
		   else{
		      	let resp = JSON.parse(body);
		        res.status(404).json({
		                    success: false,
		                    msg: "Error"
		                    });
		   }
	   }

    	Request(options, callback);

    }); 


	//busqueda de producto por referencia
	app.get('/products/id/:id&ip_api=:ip_api&ver=:ver&port=:port&token=:token', (req, res) => {
      
      var query = {
        id: req.params.id,
        ip_api: req.params.ip_api,
        ver: req.params.ver,
        port: req.params.port,
        token: req.params.token
        };

      var address = query.ip_api;
      if(query.port != ''){
      	address = query.ip_api+':'+query.port;
      }

      const options = {
        url: 'http://'+address+'/'+query.ver+'/products/'+query.id,
          headers: {
            'Authorization': 'Bearer '+query.token
          }
      };     
      
      function callback(error, response, body) {
	       if (!error && response.statusCode == 200) {
	        
	        let resp = JSON.parse(body);

	        if(typeof resp.Products === "undefined" ){
			var productos = resp.data;
			//console.log("usa data");
			}
			else{
				var productos = resp.Products;
				//console.log("usa resp.Products");
			}
	        
	        res.status(200).json({
	                    error: false,
	                    message: "success",
	                    Product: productos
	                    });
	  	   }
		   else{
		      	let resp = JSON.parse(body);
		        res.status(404).json({
		                    success: false,
		                    msg: "Error"
		                    });
		   }
	   }

    	Request(options, callback);

    });

	//busqueda de producto por varios ID_ARTICULO
	app.get('/products/ids/id=:ids&warehouse_list=:warehouse_list&ip_api=:ip_api&ver=:ver&port=:port&token=:token', (req, res) => {
      
      var query = {
        ids: req.params.ids,
        warehouse_list: req.params.warehouse_list,
        ip_api: req.params.ip_api,
        ver: req.params.ver,
        port: req.params.port,
        token: req.params.token
        };

      var address = query.ip_api;
      if(query.port != ''){
      	address = query.ip_api+':'+query.port;
      }

      const options = {
        url: 'http://'+address+'/'+query.ver+'/products?id='+query.ids+'&warehouse_list='+query.warehouse_list,
          headers: {
            'Authorization': 'Bearer '+query.token
          }
      };
         
      function callback(error, response, body) {
	        if (!error && response.statusCode == 200) {
	        
	        let resp = JSON.parse(body);

	        if(typeof resp.Products === "undefined" ){
			var productos = resp.data;
			//console.log("usa data");
			}
			else{
				var productos = resp.Products;
				//console.log("usa resp.Products");
			}
	        
	        res.status(200).json({
	                    error: false,
	                    message: "success",
	                    Products: productos
	                    });
	        }
		    else{
		      	let resp = JSON.parse(body);
		        res.status(404).json({
		                    success: false,
		                    msg: "Error"
		                    });
		    }
	   }

    	Request(options, callback);

    }); 


}
