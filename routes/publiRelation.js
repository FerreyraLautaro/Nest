const Request = require('request');
const fs =require('fs');

const Parameters = require('../models/parameters');
const ModelRelationRel = require('../models/relationsRel');


module.exports = function(app){

	app.post('/nuevarelacion', (req, res) => {
    var dataItem = {
      origin_id: req.body.origin_id,
      destination_id: req.body.destination_id,
      database: req.body.database,
      id_service: req.body.id_service
    };

    console.log(dataItem);
    console.log(tiene_letras(dataItem.origin_id));

    var service2 = 0;
    if(tiene_letras(dataItem.origin_id) == 1 && dataItem.database == 'client_deplano_relations'){
    	service2 = 1;
    }



    	Parameters.getparamsID(dataItem.id_service, (err, data) => {
	      	if (data) {
		      	console.log("trajo parametros");
		      	//let resp = JSON.parse(data);
		        //guardamos parametros del cliente
		      	for (var i = 0; i<data.length; i++){

		      		if(data[i].name =='ip_api_flx')
		      			var ip_api_flx = data[i].value;
		      		if(data[i].name =='meli_access_token')
		      			var meli_access_token = data[i].value;
		      		if(data[i].name =='meli_refresh_access_token')
		      			var meli_refresh_access_token = data[i].value;
		      		if(data[i].name =='users_meli_ids')
		      			var users_meli_ids = data[i].value;
		      		if(data[i].name =='warehouse_list')
		      			var warehouse_list = data[i].value;
		      		if(data[i].name =='protocol')
		      			var protocol = data[i].value;
		      		if(data[i].name =='token')
		      			var token = data[i].value;
		      		if(data[i].name =='port')
		      			var port = data[i].value;
		      		if(data[i].name =='version')
		      			var version = data[i].value;
		      		if(data[i].name =='equivalencia_talle')
		      			var talle_eq = data[i].value;
		      		if(data[i].name =='typeOfStock')
	      				var typeOfStock = data[i].value;
	      			if(data[i].name =='manufacturer_round')
	      				var manufacturer_round = data[i].value;
	      			if(data[i].name =='category_default')
	      				var category_default = data[i].value;
	      			if(data[i].name =='prestashop_data')
	      				var prestashop_data = data[i].value;
	      			if(data[i].name =='prestashop_url')
	      				var prestashop_url = data[i].value;

		       	}

		      	//console.log(meli_refresh_access_token);
		      	var client_id ='2189962971708303';
		      	var client_secret ='sVu238Qnoi5e2OeUJV3rnq9zkVAOdtkz';
		      	// if(serviceData.mode == 't'){
		      	//  	client_id = '3672130686948413';
		      	// 	client_secret = 'NxNML45RGLytsGc0hn0dnNxCXJuSJ9XN';
		      	// }

		      	var address = ip_api_flx;
				if(port != ''){
					address = ip_api_flx+':'+port;
				}

				getProducts(protocol,address,version,dataItem.origin_id,warehouse_list, token, service2, function(err, resp){

					if(resp){
						console.log("trajo productos");

						if(typeof resp.Products === "undefined" ){
							var productos = resp.data;
							console.log("usa data");
						}
						else{
							var productos = resp.Products;
							console.log("usa resp.Product");
						}	


						if(productos[0] == null ){
							
							//console.log("no se encuentra:"+dataItem.origin_id);
							res.status(500).json({
					          success: false,
					          msg: "no se encuentra el producto"
					        });
					        return;
						}

						// if( resp.Products[0]!= null)
						// 	var productos =resp.Products;
						// if( resp.data[0]!= null)
						// 	var productos = resp.data;

						//el metodo getProducts puede traer mas de un producto, aca solo tomo el correcto
						for(var p = 0; p<productos.length; p++){
							//console.log("id_articulo: "+resp.Products[p].ID_ARTICULO);

							if(productos[p].ID_ARTICULO == dataItem.origin_id || service2 == 1){

								

								var id_articuloflx = productos[p].ID_ARTICULO;

								
							}

						}

			
						//console.log(referencia);
						

							var relationData = {
						      id: null,
						      date_add: null,
						      date_upd: null,
						      destination_id: dataItem.destination_id,
						      integration_id: 1,
						      model_id: 1,
						      origin_id: id_articuloflx,
						      database: dataItem.database
						    };

						    ModelRelationRel.insertRelation(relationData, (err, data) => {
						      if (data) {
						      	//console.log(data);
						        res.status(200).json({
						          success: true,
						          msg: "Inserted a new Relation",
						          data: data
						        });
						        // res.redirect('/users/' + data.insertId);
						      } else {
						        res.status(500).json({
						          success: false,
						          msg: "Error"
						        });
						      }
						    });//insertrelation
							


					}//if resp	

				});//getProducts

			}//if data

	      });//getparamsID
    
  	});//post item



	function getProducts(protocol,address, version, origin_id, warehouse_list, token, service2, callback){

		//fallas.push({"origin_id":origin_id});
		//console.log(fallas);

		//console.log('http://'+address+'/'+version+'/products/'+origin_id+'?warehouse_list='+warehouse_list);
		//console.log(origin_id);         products/009076?warehouse_list=003

		if(service2 == 1){

			var options = {
	        url: protocol+'://'+address+'/'+version+'/products/'+origin_id+'?warehouse_list='+warehouse_list,
	          headers: {
	            'Authorization': 'Bearer '+token,
	            'Connection': 'close'
	          }

	    	};
		}else{

			var options = {
		        url: protocol+'://'+address+'/'+version+'/products?id='+origin_id+'&warehouse_list='+warehouse_list,
		          headers: {
		            'Authorization': 'Bearer '+token,
		            'Connection': 'close'
		          }

		    };
	    }

	    //console.log(options);  
	
		function callback1(error, response, body) {
	       if (!error && response.statusCode == 200) {
	        
	        //console.log(body);
	        let resp = JSON.parse(body);
	        //console.log(resp+"-"+destination_id);
	        
	        callback(null,resp);
		   
		   }
		   else{
		     
		   	//socket.push(origin_id);
		   	console.log("Error consulta a Flexxus");

		   	//let err = JSON.stringify(error);

		   	//console.log(error.code);
		   	
		   	if(error){
		   		if(error.code == 'ECONNRESET'){

		   		console.log("nuevo intento");
		   		getProducts(address, version, origin_id, warehouse_list, token, callback);

		   		}
		   	}
		   	else{

		   		// console.log(response.statusCode);
			    // console.log(error);
			    // console.log(body);  	
			   	var serviceDown="Error consulta a API Flexxus"+" error "+error+ " body  "+body;
				
				fs.writeFile(__dirname+'/../Logs/Error/ErrorFLX.txt', serviceDown, function (err) {
					  if (err) throw err;
					  //console.log('Archivo de Mala conexion Guardado');
				});
		      	
		   		callback("Error",null);

		   		}
	    

		    }
		    
	    }

      	Request(options, callback1);
		// Request.shouldKeepAlive = false;
	}

	
	var letras="abcdefghyjklmnñopqrstuvwxyz";

	function tiene_letras(texto){
	   texto = texto.toLowerCase();
	   for(i=0; i<texto.length; i++){
	      if (letras.indexOf(texto.charAt(i),0)!=-1){
	         return 1;
	      }
	   }
	   return 0;
	}

}