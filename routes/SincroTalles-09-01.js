var Request = require('request');

const fs =require('fs');
const Parameters = require('../models/parameters');
const ModelRelationRel = require('../models/relationsRel');

const Talles = require ('../models/tallesRelation');

var fallas = [];
var actualizado = [];


module.exports = function(app){


	//app.post('/sincro/id_service=:id_service&database=:database&mode=:mode', (req, res) => {
	app.get('/sincrotalles/id_service=:id_service&database=:database&mode=:mode', (req, res) => {
	    	
	//req.setTimeout(190000);

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
	      		if(data[i].name =='equivalencia_talle')
	      			var talle_eq = data[i].value;
	      		if(data[i].name =='interval')
	      			var interval = data[i].value;
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
	            				
	            			//console.log(body);
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
										 											 	
											console.log("trajo relaciones");
											//console.log(data);

											var address = ip_api_flx;
												if(port != ''){
												address = ip_api_flx+':'+port;
											}

											
											actualizado =[];
											fallas =[];
											

											data.forEach((producto,i)=>{
												
												// console.log("origin_id: "+producto.origin_id);
												// console.log("destination_id: "+producto.destination_id);

												//llamada a funcion externa
												setTimeout( function (i) {getProducts(address,version,producto.origin_id,producto.destination_id,warehouse_list, token, serviceData.id_service, serviceData.database, function(err, resp){

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

																//redondeo
																price = toFixedTrunc(Number.parseFloat(price).toFixed(1),2);

																//vanguard quitar decimales
																if( serviceData.id_service == 25 )
																{
																	
																	price = toFixedTrunc(price,0);

																}


																var stock = productos[p].STOCKTOTALDEPOSITO;
																if(stock < 0){
																	stock = 0;
																}

																var coeficiente_iva = productos[p].COEFICIENTEIVA;
																
																var usaTalle = productos[p].TALLES;

																var superRubro = productos[p].DESCRIPCION_CATEGORIA;
																//var superRubro = productos[p].DESCRIPCION_CATEGORIA.split(' ', 1);

																var marca = productos[p].DESCRIPCION_MARCA;

																var referencia = productos[p].CODIGO_PRODUCTO;
															}

														}

														//console.log("precio: "+price+" stock: "+stock);
																													
														if(usaTalle){
															var color = '';
															var pictures = '';
															var variations = [];
															var equiTalles = [];
															var tallesRopa = 0;
															var pictures2 = [];
															var wheel_size = '';

															getVariantesMeli(producto.destination_id, function(err, respMeli){

																//console.log(respMeli);
																if(respMeli == ''){
																	
																	//console.log("Sin talles en Meli "+producto.destination_id);
																	
																	//llamada a funcion put a ML
																	putMeli(producto.destination_id, price, stock, meli_token, function(err, response){

																		if(response){
																			
																			actualizado.push("\r\nSe Actualizo: "+producto.destination_id+ " Price: "+ price+ " Stock: "+stock );										
																			console.log("Se Actualizo: "+response.id+ " Price: "+ response.price+ " Stock: "+response.available_quantity );
																		}
																		else{

																			let error = JSON.parse(err);
																			console.log(error.message);
																			console.log("Error - destination_id:"+producto.destination_id+ " price:"+price);

																			fallas.push(JSON.stringify({"MLA":producto.destination_id,"price":price,"error":error.message}));
																			addLogFailMl(serviceData.id_service,serviceData.database,fallas);																				
																			
																			
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

																	});

																}//if respMeli donde no hay variaciones
																else
																{
																	//console.log("con talle en meli");
																	//necesito el color de la combinacion
																	for(var m = 0; m<respMeli.length; m++){

																		for( var ac= 0; ac<respMeli[m].attribute_combinations.length; ac++){
																		
																			var id_att_comb = respMeli[m].attribute_combinations[ac].id;
																																					
																			if(id_att_comb =='COLOR')
																			{
																				color = respMeli[m].attribute_combinations[ac].value_name;

																			}//if id_att_comb == size

																			// var busca_talle = id_att_comb.indexOf("SIZE");
																			// if(busca_talle != -1){

																			//     tallesRopa = 1;

																			// }

																			var busca_wheel = id_att_comb.indexOf("WHEELS");
																			if(busca_wheel != -1){

																			    wheel_size = respMeli[m].attribute_combinations[ac].value_name;

																			}

																		    if(id_att_comb !='COLOR')
																		 	{
																		 		tallesRopa = 1;
																			}
																	
																		}//for atributte combinations

																	

																	}//for resp meli
																	//fin color

																	if(respMeli[0].picture_ids != undefined){
																		pictures = respMeli[0].picture_ids;
																		}else{
																			pictures = '';
																		}
																	
																	if(serviceData.id_service == 27 && tallesRopa != 1){

																		pictures2 = [];

																		//if(producto.destination_id == 'MLA788610096'){

																			for(var f = 0; f<respMeli.length; f++){

																				if(respMeli[f].picture_ids != undefined){
																				
																					for(var w = 0; w< respMeli[f].picture_ids.length; w++ ){

																						if(respMeli[f].picture_ids[w] )
																						pictures2 = pictures.concat(respMeli[f].picture_ids)

																					}

																				}	
																			}			


																			var imagenes = [];
																			for(var w = 0; w< pictures2.length; w++ ){

																			  var position = imagenes.indexOf(pictures2[w])
																			  //console.log(img[w]);
																			  if(position == -1){

																			    imagenes.push(pictures2[w]);

																			  }



																			}
																					
																			pictures = imagenes;

																			//console.log( imagenes);	
																		//}
																	}
																	//console.log( pictures2);



																	//busco el stock de los talles
																	getStockTalles(address, version, producto.origin_id, warehouse_list, token, function(err, stkTalles){

																		//reduce en un array los nombres de los talles/lotes
																		let a = stkTalles.data;
																		let lotes = a.map(item => item.TALLE).filter((value, index, self) => self.indexOf(value) === index);
																		//console.log(lotes);
																		//console.log(a);
																		var dataTalles = {
																				database : serviceData.database,
																				talles : lotes,
																				rubroFlx : superRubro,
																				manufacturer : marca
																		}

																		
																		//busco las equivalencias de los talles mandando un array con los talles
																		getEqTalle(dataTalles, function(err, equiTalles){
																																									
																			//console.log(equiTalles);
																			var nombreTalle ='';
																			var cantidadxTalle = 0;
																			var talle_original = null;

																			//lotes.forEach((lote,l)=>{
																			for(var l = 0; l<lotes.length; l++){

																				for (var p = 0; p < stkTalles.data.length; p++)
																				{

																					if(lotes[l] == stkTalles.data[p].TALLE){

																						cantidadxTalle += stkTalles.data[p].STOCKREMANENTE;

																						if(cantidadxTalle < 0){
																							cantidadxTalle = 0;
																						}
																						
																						nombreTalle = stkTalles.data[p].TALLE;

																						//console.log("nombretalle = "+nombreTalle);

																						if(stkTalles.data[p].PRECIO){
																						//console.log("Precio del talle: "+ toFixedTrunc(stkTalles.data[p].PRECIO * coeficiente_iva,2));
																						price = toFixedTrunc(stkTalles.data[p].PRECIO * coeficiente_iva,2);
																						
																						}
																																										
																					}

																				}	
																				
																				//check si usa equivalencias
																				if(talle_eq == 1){
																					//recorro las equivalencias y obtengo la que corresponde
																					for(var c=0; c<equiTalles.length; c++ ){
																						
																						var json = equiTalles[c];
																						if(json.talle == nombreTalle){
																							
																							nombreTalle = json.equivalencia;
																							talle_original = json.talle;

																							//console.log("talle original ->"+talle_original);
																						}
																																										
																					}

																				}
																				
																				//console.log(nombreTalle + " nombretalle en la funcion");

																				if(wheel_size != ''){

																					wheel_size ={
																					                'id': 'WHEELS_SIZE',
																					                'name': 'Tamaño de las ruedas',
																					                'value_name': wheel_size
																					            }
																				}

																				
																				if(tallesRopa == 1 )
																				{
																					var attribute_combination = {
																						  "attribute_combinations": [
																						        {
																						            "id": "COLOR",
																					                "name": "Color",
																					                "value_name": color,
																					            },
																					            {
																					                "id": "SIZE",
																					                "name": "Talle",
																					                "value_name": nombreTalle,
																					            }
																						    ],
																						    "attributes": [ 
																						    	{ 
																						    		"id": "EAN", 
																						    		"value_id": "-1",
      																								"value_name": null 
																						    	},
																						    	{
																									"id": "SELLER_SKU",
																									"value_name": referencia
																								} 
																						    ],  
																						    "price": price,
																						    "available_quantity": cantidadxTalle,
																						    "seller_custom_field": talle_original,
																						    "picture_ids": pictures
																						        
																						};
																				}
																				else{
																					if(nombreTalle == 'U')
																					{

																						nombreTalle =  color;																						
																					}

																					var attribute_combination = {
																						  "attribute_combinations": [
																						        {
																						            "id": "COLOR",
																					                "name": "Color",
																					                "value_name": nombreTalle,
																					            }
																						    ],
																						    "attributes": [ 
																						    	{ 
																						    		"id": "EAN", 
																						    		"value_id": "-1",
      																								"value_name": null 
																						    	},
																						    	{
																									"id": "SELLER_SKU",
																									"value_name": referencia
																								}  
																						    ],  
																						    "price": price,
																						    "available_quantity": cantidadxTalle,
																						    "seller_custom_field": talle_original,
																						    "picture_ids": pictures
																						        
																						};

																						//console.log("coloco N/A");

																				}


																				//console.log( attribute_combination);	
																																							
																				variations.push(attribute_combination);
																				
																				cantidadxTalle = 0; //reinicio la variable
															
																				
																			}//for lotes

																			
																			actualizado.push("\r\nSe Actualizo: "+producto.destination_id+ " Price: "+ price+ " Stock: "+stock );


																			//llamada a funcion put a ML
																			putMeliTalles(producto.destination_id, JSON.stringify( {"variations":variations} ), meli_token, function(err, response){
																				
																				
																				if(response){
																					
																					console.log("Se Actualizo: "+response.id);
																																						
																				}
																				else{

																					let error = JSON.parse(err);

																					console.log(error.message);
																					console.log(error);
																					console.log("Error - destination_id:"+producto.destination_id);

																					//fallas.push(JSON.stringify({"destination_id":producto.destination_id}));

																					fallas.push("\r\nError - destination_id:"+producto.destination_id);
																					
																					addLogFailMl(serviceData.id_service,serviceData.database,fallas);																
																					
																					
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
																			

																			});//putMeli
	
																																				
																		});//getEq		
																	
																	});//getStockTalles
																
																}//else no hay variaciones
															
															});//getvariantesMeli
														
														
														}//if usatalle		
														
														else{ 

															//llamada a funcion put a ML
															putMeli(producto.destination_id, stock, meli_token, function(err, response){

																actualizado.push("\r\nSe Actualizo: "+producto.destination_id+ " Price: "+ price+ " Stock: "+stock );

																if(response){
																	//let r =JSON.parse(response);
																	//console.log(response);
																	
																	console.log("Se Actualizo: "+response.id+ " Price: "+ response.price+ " Stock: "+response.available_quantity+" id_service: "+serviceData.id_service );
																
																}
																else{

																	let error = JSON.parse(err);
																	console.log(error.message);
																	console.log("Error - destination_id:"+producto.destination_id+ " price:"+price);

																	fallas.push(JSON.stringify({"MLA":producto.destination_id,"price":price,"error":error.message}));
																	//fallas.push("\r\nError - destination_id:"+producto.destination_id+ " price:"+price);

																	addLogFailMl(serviceData.id_service,serviceData.database,fallas);
																	
																	
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
								

															});//putMeli sin talles


														}//else no tiene talle

													
													} //if resp
														
													
												})}, interval * i, i);//getProducts	
											
											});	//foreach									

										}//data
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


	function putMeli(destino_id, stock, meli_token, callback){

		Request.put({
        "headers": { "Content-Type": "application/json" },
        "url": 'https://api.mercadolibre.com/items/'+destino_id+'?access_token='+meli_token,
        "body": '{"available_quantity":"'+stock+'"}'
               
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

		var options = {
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
		   	
		   	if(error){
		   		if(error.code == 'ECONNRESET'){

		   		console.log("nuevo intento");
		   		getProducts(address, version, origin_id, destination_id, warehouse_list, token, id_service, database, callback);

		   		}
		   	}
		   	else{

		   		// console.log(response.statusCode);
			    // console.log(error);
			    // console.log(body);  	
			   	var serviceDown="Error consulta a API Flexxus"+" error "+error+ " body  "+body;
				
				fs.writeFile(__dirname+'/../Logs/Error/ErrorFLX-'+id_service+'-'+database+'.txt', serviceDown, function (err) {
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


	function getVariantesMeli(destination_id, callback){

		//https://api.mercadolibre.com/items/MLA747366712/variations
		var options = {
	        url: 'https://api.mercadolibre.com/items/'+destination_id+'/variations'
	    };  


	    function callback2(error, response, body) {
	       if (!error && response.statusCode == 200) {
	        
	        //console.log(body);
	        let respVariantes = JSON.parse(body);
	        //console.log(resp+"-"+destination_id);
	        
	        callback(null,respVariantes);
		   
		   }
		   else{
		     
			   	//socket.push(origin_id);
			   	console.log("Error consulta a MELI ->  MLA-> "+destination_id);

			   	//let err = JSON.stringify(error);

			   	//console.log(error.code);
			   	
			   	if(error){
			   		
			   		console.log(error);
		   		
			   	}
			   	else{

			   		
			   		console.log("else status != 200");

			   	}

		    }
		    
	    }


	    Request(options, callback2);	

	}


	function getStockTalles(address, version, origin_id, warehouse_list, token, callback){

		var options = {
	        url: 'http://'+address+'/'+version+'/stock/'+origin_id+'?warehouse_list='+warehouse_list+'&update_from=01-01-1900',
	          headers: {
	            'Authorization': 'Bearer '+token,
	            'Connection': 'close'
	          }

	    };

	    function callback3(error, response, body) {
	       if (!error && response.statusCode == 200) {
	        
	        //console.log(body);
	        let respStockTalles = JSON.parse(body);
	        //console.log(resp+"-"+destination_id);
	        
	        callback(null,respStockTalles);
		   
		   }
		   else{
		     
			   	//socket.push(origin_id);
			   	console.log("Error consulta a FLX talles ->  ID_ARTICULO-> "+origin_id);

			   	//let err = JSON.stringify(error);

			   	//console.log(error.code);
			   	
			   	if(error){
			   		
			   		console.log(error);
		   		
			   	}
			   	else{
			   		
			   		console.log("else status != 200");

			   	}

		    }
		    
	    }


	    Request(options, callback3);
	}


	function putMeliTalles(destino_id, jsonMeli, meli_token, callback){

		Request.put({
        "headers": { "Content-Type": "application/json" },
        "url": 'https://api.mercadolibre.com/items/'+destino_id+'?access_token='+meli_token,
        "body": jsonMeli
               
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


	function getEqTalle(dataTalles, callback){

		Talles.getEquivalencia(dataTalles, (err, data) => {
		 if (data) {

		 	//console.log(data);
			 	
	 		//console.log(data[0].talle_arg);

	 		callback(null,data);	
		
		} else {
	        res.status(500).json({
	          success: false,
	          msg: 'Error buscando equivalencias'
	        });
	      }
	    });	//get equivalencia talles

	}

	function toFixedTrunc(value, n) {
	  const v = value.toString().split('.');
	  if (n <= 0) return v[0];
	  let f = v[1] || '';
	  if (f.length > n) return `${v[0]}.${f.substr(0,n)}`;
	  while (f.length < n) f += '0';
	  return `${v[0]}.${f}`
	}
	

	function addLogFailMl(id_service, database, fallas){

		fs.writeFile(__dirname+'/../Logs/Error/ErrorML-'+id_service+'-'+database+'.txt', fallas, function (err) {
		  if (err) throw err;
		  console.log('Archivo de Errores Guardado');
		});

	}



	/**
	   * Ajuste decimal de un número.
	   *
	   * @param {String}  tipo  El tipo de ajuste.
	   * @param {Number}  valor El numero.
	   * @param {Integer} exp   El exponente (el logaritmo 10 del ajuste base).
	   * @returns {Number} El valor ajustado.
	   */
	  function decimalAdjust(type, value, exp) {
	    // Si el exp no está definido o es cero...
	    if (typeof exp === 'undefined' || +exp === 0) {
	      return Math[type](value);
	    }
	    value = +value;
	    exp = +exp;
	    // Si el valor no es un número o el exp no es un entero...
	    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
	      return NaN;
	    }
	    // Shift
	    value = value.toString().split('e');
	    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
	    // Shift back
	    value = value.toString().split('e');
	    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	  }

	  // Decimal round
	  if (!Math.round10) {
	    Math.round10 = function(value, exp) {
	      return decimalAdjust('round', value, exp);
	    };
	  }
	  // Decimal floor
	  if (!Math.floor10) {
	    Math.floor10 = function(value, exp) {
	      return decimalAdjust('floor', value, exp);
	    };
	  }
	  // Decimal ceil
	  if (!Math.ceil10) {
	    Math.ceil10 = function(value, exp) {
	      return decimalAdjust('ceil', value, exp);
	    };
	  }

	
	


}