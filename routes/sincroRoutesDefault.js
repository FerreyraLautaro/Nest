const Request = require('request');

const fs =require('fs');
const Parameters = require('../models/parameters');
const ModelRelationRel = require('../models/relationsRel');


var fallas = [];
var actualizado = [];

module.exports = function(app){

	app.get('/sincro/id_service=:id_service&database=:database&mode=:mode', (req, res) => {
	    var serviceData = {      
	      id_service: req.params.id_service,
	      database: req.params.database,
	      mode: req.params.mode
	    };

	    // fin declaracion de variables para traer info para sincro

	    Parameters.getparamsID(serviceData.id_service, (err, data) => {
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
	       	}

	      	//console.log(meli_refresh_access_token);
	      	var client_id ='2189962971708303';
	      	var client_secret ='sVu238Qnoi5e2OeUJV3rnq9zkVAOdtkz';
	      	if(serviceData.mode == 't'){
	      	 	client_id = '3672130686948413';
	      		client_secret = 'NxNML45RGLytsGc0hn0dnNxCXJuSJ9XN';
	      	}
	      	
	      	//post para refresh_token a Meli
		      	Request.post({
	            "headers": { "Content-Type": "application/json" },
	            "url": 'https://api.mercadolibre.com/oauth/token',
	            "body": '{"client_id":"'+client_id+'","client_secret":"'+client_secret+'","grant_type":"refresh_token","refresh_token":"'+meli_refresh_access_token+'"}'
	                   
	            }, (error, response, body) => {

	            		if(response.statusCode != 200) {
	            			res.status(500).json({
					          success: false,
					          msg: 'Error del post refresh token'
					        });
						}
						else {	
							let resp = JSON.parse(body);
							console.log("token refrescado");

							 var dataParameter = {
						      id: null,
						      service_id: serviceData.id_service,
						      name: 'meli_access_token',
						      value: resp.access_token   
						     };
							
							 var meli_token = resp.access_token;

							 Parameters.insert(dataParameter, (err, data) => {
							      if (data) {
							        console.log("token guardado");
							        //console.log(serviceData.database);
							        var datab = { database: serviceData.database};		
							        
							        ModelRelationRel.getRelation(datab, (err, data) => {

										//console.log("trajo las relaciones");
							      		//console.log(data);
										
										if(data){

											//variables para comparar luego la cantidad de puts enviados a meli y la cant de respuestas
										 	var requestML=0;
										 	var responseML=0;
										 	var cantProd = data.length;
										 	var cantNoEnc = 0;
										 
											console.log("trajo relaciones");
											//console.log(data);

											var address = ip_api_flx;
											if(port != ''){
												address = ip_api_flx+':'+port;
											}

											//console.log(address);
											
											actualizado = [];
											fallas =[];

											data.forEach((producto,i)=>{
												
												// console.log("origin_id: "+producto.origin_id);
												// console.log("destination_id: "+producto.destination_id);

													
												//llamada a funcion externa
												getProducts(address,version,producto.origin_id,producto.destination_id,warehouse_list, token, serviceData.id_service, serviceData.database, function(err, resp){

														if(resp){
															
														if(typeof resp.Products === "undefined" ){
														var productos = resp.data;
														//console.log("usa data");
														}
														else{
															var productos = resp.Products;
															//console.log("usa resp.Products");
														}	


																													
														if(productos[0] == null){
															
															console.log("no se encuentra:"+producto.destination_id);
															return;
														}
														
														//el metodo getProducts puede traer mas de un producto, aca solo tomo el correcto
														for(var p = 0; p<productos.length; p++){
															//console.log("id_articulo: "+resp.Products[p].ID_ARTICULO);

															if(productos[p].ID_ARTICULO == producto.origin_id){

																//console.log("id igual: "+resp.Products[p].ID_ARTICULO);
																var price = toFixedTrunc(productos[p].PRECIOVENTA*productos[p].COTIZACIONMONEDA,2);
																if(productos[p].PRECIOPROMOCION != 0){
																	price = toFixedTrunc(productos[p].PRECIOPROMOCION*productos[p].COTIZACIONMONEDA,2);
																}
																var stock = productos[p].STOCKTOTALDEPOSITO;
																if(stock < 0){
																	stock = 0;
																}

																var usaTalle = productos[p].TALLES;

																var superRubro = productos[p].DESCRIPCION_CATEGORIA.split(' ', 1);

															}

														}
															//console.log(toFixedTrunc(resp.Products[0].PRECIOVENTA,2));

															
															actualizado.push("\r\nSe Actualizo: "+producto.destination_id+ " Price: "+ price+ " Stock: "+stock );
															
															//console.log("requesML:"+requestML+"cantProd:"+cantProd);
															//comparo la cantidad de respuestas con la cantidad de productos enviados
															//if(requestML == cantProd){

															// 	fs.writeFile('Actualizacion-'+serviceData.id_service+'-'+serviceData.database+'.txt', actualizado, function (err) {
															// 	  if (err) throw err;
															// 	  console.log('Archivo de Actualizacion Guardado');
															// 	});
															// }




															//llamada a funcion put a ML
															putMeli(producto.destination_id, price, stock, meli_token, function(err, response){

																responseML++;//aumento el nro de respuestas recibidas de ML

																if(response){
																	//let r =JSON.parse(response);
																	//console.log(response);
																	
																	console.log("Se Actualizo: "+response.id+ " Price: "+ response.price+ " Stock: "+response.available_quantity+ " id_service:"+serviceData.id_service );

																	
																	
																}
																else{

																	let error = JSON.parse(err);
																	console.log(error.message);
																	console.log("Error - destination_id:"+producto.destination_id+ " price:"+price);

																	fallas.push(JSON.stringify({"MLA":producto.destination_id,"price":price,"error":error.message}));
																	//fallas.push("\r\nError - destination_id:"+producto.destination_id+ " price:"+price);

																	
																	fs.writeFile(__dirname+'/../Logs/Error/ErrorML-'+serviceData.id_service+'-'+serviceData.database+'.txt', fallas, function (err) {
																	  if (err) throw err;
																	  console.log('Archivo de Errores Guardado');
																	});
																	
																}

																if(data.length-1 == i){

																	fs.writeFile(__dirname+'/../Logs/Sincros/Actualizacion-'+serviceData.id_service+'-'+serviceData.database+'.txt', actualizado, function (err) {
																  	if (err) throw err;
																  	console.log('Archivo de Actualizacion Guardado');
																	});

																	res.status(200).json({
																    success: true,
																    msg: "productos actualizados"
																    });
																}

																// if(responseML == requestML-1){
																// 	res.status(200).json({
																//     success: true,
																//     msg: "productos actualizados"
																//     });
																// }

															});
														

														}

														// else if(!resp){

														// 	//fallas.push(JSON.stringify({"origin_id":producto.origin_id}));

														// 	var serviceDown="No se puede conectar a API Flexxus";
														// 	if(data.length-1 == i){
														// 		fs.writeFile('Servicio caido-'+serviceData.id_service+'-'+serviceData.database+'.txt', serviceDown, function (err) {
														// 			  if (err) throw err;
														// 			  console.log('Archivo de Mala conexion Guardado');
														// 		});

														// 		console.log("Error para conectarse a Flexxus -> id_service="+serviceData.id_service);
														// 	}

														// }
														
												});		
											})										

										}
										else{
											res.status(500).json({
								          	success: false,
								         	 msg: "error tabla relation"
								        	});
										
										}//if else de traer relaciones
							      		
							    	});	//trae relaciones
  							        
							      } else {
							        res.status(500).json({
							          success: false,
							          msg: "Error actualizando token"
							        });
							      
							      }// if else del guardar token

						    });//fin insert token refrescado en la tabla parameter

						}//else status200 ML refresh

	            			            	
	            	 }//body error response body

	            );//fin del post refresh token	 
			
	        //res.status(200).json({data});
	       } else {
	        res.status(500).json({
	          success: false,
	          msg: 'Error del parametros'
	        });
	      }
	    });//get que trae todos los parametros del cliente


	});//fin /sincro


	function putMeli(destino_id, price, stock, meli_token, callback){

		Request.put({
        "headers": { "Content-Type": "application/json" },
        "url": 'https://api.mercadolibre.com/items/'+destino_id+'?access_token='+meli_token,
        "body": '{"price":"'+price+'","available_quantity":"'+stock+'"}'
               
        }, (error, response, body) => {

        	if(response.statusCode != 200) {
    			let respuesta = JSON.parse(body);
    			
    			if(respuesta.status==409){
    				console.log("articulo locked: "+destino_id);
    			
    			}

    			callback(body,null);

    			// res.status(500).json({
		        //   success: false,
		        //   producto: destination_id,
		        //   msg: respuesta
		        // });
			}
			else {
				let respuesta = JSON.parse(body)
				//console.log("MLA Actualizado:"+respuesta.id);	
				
				callback(null,respuesta);

				
				
			}

		});

		
	}
	


	function getProducts(address, version, origin_id, destination_id, warehouse_list, token, id_service, database, callback){

		//fallas.push({"origin_id":origin_id});
		//console.log(fallas);

		//console.log('http://'+address+'/'+version+'/products/'+origin_id+'?warehouse_list='+warehouse_list);
		//console.log(origin_id);         products/009076?warehouse_list=003

		const options = {
	        url: 'http://'+address+'/'+version+'/products?id='+origin_id+'&warehouse_list='+warehouse_list,
	          headers: {
	            'Authorization': 'Bearer '+token,
	            'Connection': 'close'
	          }
	    };  
	
		function callback1(error, response, body) {
	       if (!error && response.statusCode == 200) {
	        
	        //console.log(body);
	        let resp = JSON.parse(body);
	        //console.log(resp+"-"+destination_id);
	        
	        callback(null,resp);
		   
		   }
		   else{
		     
		   	//socket.push(origin_id);
		   	console.log("Error consulta a Flexxus -> id_service="+id_service+" MLA-> "+destination_id);

		   	//let err = JSON.stringify(error);

		   	//console.log(error.code);
		   	

		   	// if(error){
		   	// 	if(error.code == 'ECONNRESET'){

		   	// 	console.log("nuevo intento");
		   	// 	getProducts(address, version, origin_id, destination_id, warehouse_list, token, id_service, database, callback);


		   	// 	}
		   	// }
		  //  	else{

		  //  		// console.log(response.statusCode);
			 //    // console.log(error);
			 //    // console.log(body);  	
			 //   	var serviceDown="Error consulta a API Flexxus"+" error "+error+ " body  "+body;
				
				// fs.writeFile(__dirname+'/../Logs/Error/ErrorFLX-'+id_service+'-'+database+'.txt', serviceDown, function (err) {
				// 	  if (err) throw err;
				// 	  //console.log('Archivo de Mala conexion Guardado');
				// });

			
		      	
		  //  		callback("Error",null);


		  //  		}

		    		
		  		var serviceDown="Error consulta a API Flexxus"+" error "+error+ " body  "+body;
				
				fs.writeFile(__dirname+'/../Logs/Error/ErrorFLX-'+id_service+'-'+database+'.txt', serviceDown, function (err) {
					  if (err) throw err;
					  //console.log('Archivo de Mala conexion Guardado');
				});

				callback("Error",null);



		    }
	    }

      	Request(options, callback1);
		
	}


	function toFixedTrunc(value, n) {
	  const v = value.toString().split('.');
	  if (n <= 0) return v[0];
	  let f = v[1] || '';
	  if (f.length > n) return `${v[0]}.${f.substr(0,n)}`;
	  while (f.length < n) f += '0';
	  return `${v[0]}.${f}`
	}
	


}