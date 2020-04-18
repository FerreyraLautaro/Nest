const Request = require('request');

const fs =require('fs');
const Parameters = require('../models/parameters');
const ModelRelationRel = require('../models/relationsRel');

var fallas = [];
var actualizado = [];
var errorStock = [];
var errorCategoria =[];
var errorNombreArt =[];

module.exports = function(app){

	app.get('/publimasiva/id_service=:id_service&database=:database&mode=:mode', (req, res) => {
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
	      		if(data[i].name =='typeOfStock')
	      			var typeOfStock = data[i].value;
	      		
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
							        
							        ModelRelationRel.getRelation(datab, (err, dataRelaciones) => {

										//console.log("trajo las relaciones");
							      		//console.log(data);
										
										if(dataRelaciones){

											//variables para comparar luego la cantidad de puts enviados a meli y la cant de respuestas
										 											 
											console.log("trajo relaciones");
											//console.log(data);

											var address = ip_api_flx;
											if(port != ''){
												address = ip_api_flx+':'+port;
											}

											//console.log(address);
											
											actualizado = [];
											fallas =[];
											errorStock = [];
											errorCategoria =[];
											errorNombreArt =[];

											
											getProducts(address,version,warehouse_list, token, serviceData.id_service, serviceData.database, function(err, productsFlx){

												if(productsFlx){

													if(typeof productsFlx.Products === "undefined" ){
														var productosFlx = productsFlx.data;
														//console.log("usa data");
													}
													else{
														var productosFlx = productsFlx.Products;
														//console.log("usa resp.Products");
													}

													console.log("ingreso productos de Flx");
													var Filtrado = [];
													
													
													dataRelaciones.forEach((datarel, d)=>{

														productosFlx.forEach((prodflx, p)=>{

															if( prodflx.ID_ARTICULO == datarel.origin_id)
													      	{
													        	productosFlx.splice(p, 1);
													  													      	
													      	}

														});

													});
													

													console.log("cantidad de productos para publicar: " + productosFlx.length);
													//console.log(Filtrado);
													productosFlx.forEach((producto,i)=>{
																											

														var price = toFixedTrunc(producto.PRECIOVENTA*producto.COTIZACIONMONEDA,2);
														if(producto.PRECIOPROMOCION != 0){
															price = toFixedTrunc(producto.PRECIOPROMOCION*producto.COTIZACIONMONEDA,2);
														}
														
														var stock = 0;
														
														if(typeOfStock == 1){
														stock = producto.STOCKTOTALDEPOSITO;
														}else if(typeOfStock == 2){
															stock = producto.STOCKREALDEPOSITO;
														}else{
															stock = producto.STOCKTOTAL;
														}
														
														if(stock < 0 || stock == null){
															stock = 0;
														}

														var nombreProducto = producto.DESCRIPCION_CATEGORIA.split(' ', 1) + ' ' + producto.DESCRIPCION_MARCA + ' ' +producto.NOMBRE;
														var nombreC = producto.NOMBRE.substring(0, 60);

														var jsonCateg = JSON.stringify([{"title": nombreProducto, "price": price}]);

														
														postCategoryPred(jsonCateg, function(err, prediction){

															if(prediction != null && prediction[0].path_from_root){


																//console.log(prediction);

																for(var c = 0; c<prediction[0].path_from_root.length; c++){

																	if( prediction[0].path_from_root.length - 1 == c)
																		categoriaPred = prediction[0].path_from_root[c].id;

																}

																//categoriaPred = prediction[0].path_from_root[3].id;

																//console.log(categoriaPred);

																var jsonMeli = JSON.stringify({
																"title":nombreC,
																"category_id":categoriaPred,
																"price":price,
																"currency_id":"ARS",
																"condition":"new",
																"available_quantity":stock,
																"buying_mode":"buy_it_now",
																"listing_type_id":"bronze",
																"pictures":[
																		{"source":"https://devnode1.mitiendaonline.com/sin-foto.jpg"}
																	]
																});

																//console.log(producto.ID_ARTICULO);
																

																publiMeli(jsonMeli, meli_access_token, function(err, publi){

																	if(publi){

																		var relationData = {
																	      id: null,
																	      date_add: null,
																	      date_upd: null,
																	      destination_id: publi.id,
																	      integration_id: 1,
																	      model_id: 1,
																	      origin_id: producto.ID_ARTICULO,
																	      database: serviceData.database
																	    };

																	    ModelRelationRel.insertRelation(relationData, (err, data) => {
																	      if (data) {
																	      	
																	      	console.log("relacion insertada");

																	      	if(productosFlx.length-1 == i){
																		      	
																		      	//console.log(data);
																		        res.status(200).json({
																		          success: true,
																		          msg: "Inserted a new Relation",
																		          data: data
																		        });
																		        // res.redirect('/users/' + data.insertId);
																	      	}

																	      } else {
																	        res.status(500).json({
																	          success: false,
																	          msg: "Error"
																	        });
																	      }
																	    });//insertrelation
																		
																	

																	}//if publi
																	

																	if(err){
																		let arr = JSON.parse(err);
																		//console.log(err.message);
																		if(arr.status == 400)
																		{
																			//console.log("status 400");

																			if(arr.cause[0] != null && arr.cause[0].cause_id == 103){
																				console.log("error -> producto sin stock");
																				errorStock.push("\r\nProducto sin stock: "+producto.CODIGO_PRODUCTO);
																			}
																			if(arr.cause[0] != null && arr.cause[0].cause_id == 350){
																				console.log("error -> hay que agregar free shipping obligatorio");
																				errorCategoria.push("\r\nCategoria / shipping incorrecto: "+producto.CODIGO_PRODUCTO);
																			}
																			if(arr.cause[0] != null && arr.cause[0].cause_id == 134){
																				console.log("error -> nombre del articulo mayor a 60 caracteres");
																				errorNombreArt.push("\r\nError nombre del producto: "+producto.CODIGO_PRODUCTO);
																			}
																		}

																		if(productosFlx.length-1 == i){	
																			
																			//console.log(err.message);
																			fs.writeFile(__dirname+'/../Logs/Error/ErrorPublicando-Stock-'+serviceData.database+'.txt', errorStock, function (err) {
																			  if (err) throw err;
																			  console.log('Archivo de Errores Guardado');
																			});
																			fs.writeFile(__dirname+'/../Logs/Error/ErrorPublicando-Categoria-'+serviceData.database+'.txt', errorCategoria, function (err) {
																			  if (err) throw err;
																			  console.log('Archivo de Errores Guardado');
																			});
																			fs.writeFile(__dirname+'/../Logs/Error/ErrorPublicando-Nombres-'+serviceData.database+'.txt', errorNombreArt, function (err) {
																			  if (err) throw err;
																			  console.log('Archivo de Errores Guardado');
																			});
																			
																			res.status(500).json({
																		          success: false,
																		          message: "productos con error"
																		    });

																		}	
																	}


																});//publiMeli



																// res.status(200).json({
														  		// success: true,
														          
														  		// });


															}//if prediction
														
															else{

																if(productosFlx.length-1 == i){	
																			
																	//console.log(err.message);
																	
																	res.status(200).json({
																          success: true
																         
																    });

																}


															}


														});//postCategoryPred

													
													});//forEach


												}//if productsFlx

											});//getProducts
											
																					

										}//if data relaciones
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


	function publiMeli(jsonMeli, meli_token, callback){

		Request.post({
        "headers": { "Content-Type": "application/json" },
        "url": 'https://api.mercadolibre.com/items?access_token='+meli_token,
        "body": jsonMeli
               
        }, (error, response, body) => {

        	if(response.statusCode != 200 && response.statusCode != 201) {
    			//console.log(body);
    			
    			let respuesta = JSON.parse(body);
    			//console.log("MLA publicado pero statuscode != 200: "+respuesta.id);
    			
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
				console.log("MLA publicado:"+respuesta.id);	
				
				callback(null,respuesta);

				
				
			}

		});

		
	}
	


	function getProducts(address, version, warehouse_list, token, id_service, database, callback){

		//'http://nicoshopping.dynns.com:5000/v2/products?warehouse='+warehouse_list+'&web_published_only=1&limit=-1';


		const options = {
	        url: 'http://'+address+'/'+version+'/products?warehouse_list='+warehouse_list+'&web_published_only=1&limit=-1',
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
		   	console.log("Error consulta a Flexxus -> id_service="+id_service+" MLA-> ");
		   	    		
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


	function postCategoryPred(jsonCateg, callback){

		Request.post({
        "headers": { "Content-Type": "application/json" },
        "url": 'https://api.mercadolibre.com/sites/MLA/category_predictor/predict',
        "body": jsonCateg
               
        }, (error, response, body) => {

        	if(response.statusCode != 200) {
    			let respuesta = JSON.parse(body);
    			 			

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

	function toFixedTrunc(value, n) {
	  const v = value.toString().split('.');
	  if (n <= 0) return v[0];
	  let f = v[1] || '';
	  if (f.length > n) return `${v[0]}.${f.substr(0,n)}`;
	  while (f.length < n) f += '0';
	  return `${v[0]}.${f}`
	}
	


}


