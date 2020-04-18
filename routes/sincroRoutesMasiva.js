const Request = require('request');

const fs =require('fs');
const Parameters = require('../models/parameters');
const ModelRelationRel = require('../models/relationsRel');

var fallas = [];
var actualizado = [];

module.exports = function(app){

	app.get('/sincromasiva/id_service=:id_service&database=:database&mode=:mode', (req, res) => {
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
													
													dataRelaciones.forEach(_art => {
													    const found = productosFlx.find(art => {
													        return _art.origin_id ===  art.ID_ARTICULO;
													    });
													    if (found) {
													        const a = {...found ,..._art };
													        Filtrado.push(a);
													    }
													});
													

													console.log("cantidad de uniones: " + Filtrado.length);

													Filtrado.forEach((producto,i)=>{


														var price = toFixedTrunc(producto.PRECIOVENTA*producto.COTIZACIONMONEDA,2);
														if(producto.PRECIOPROMOCION != 0){
															price = toFixedTrunc(producto.PRECIOPROMOCION*producto.COTIZACIONMONEDA,2);
														}
														

														if( serviceData.id_service == 8 )
														{
															var price = toFixedTrunc(producto.PRECIOVENTA*producto.COTIZACIONMONEDA+600,2);
															if(producto.PRECIOPROMOCION != 0){
																price = toFixedTrunc(producto.PRECIOPROMOCION*producto.COTIZACIONMONEDA+600,2);
															}
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

														var pausado = false;
														//"body": '{"price":"'+price+'","available_quantity":"'+stock+'"}'
														// if( serviceData.id_service == 15 )
														// {
														// 	pausado = true;
														// }


														var today = new Date();
														var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
														var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
														var dateTime = date+' '+time;
															
														actualizado.push("\r\n"+dateTime+" Se Actualizo: "+producto.destination_id+ " Price: "+ price+ " Stock: "+stock );


														//llamada a funcion put a ML
														putMeli(producto.destination_id, price, stock, meli_token, pausado, function(err, response){
															
															if(response){
																//let r =JSON.parse(response);
																//console.log(response);
																																
																console.log(dateTime+" Se Actualizo: "+response.id+ " Pce: "+ response.price+ " Stk: "+response.available_quantity+ " id_serv:"+serviceData.id_service + " Prod: "+i );
																										
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

																console.log("Productos relacionados: "+i );

																res.status(200).json({
															    success: true,
															    msg: "productos actualizados"
															    });
															}
															

														});//putMeli



													});


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


	function putMeli(destino_id, price, stock, meli_token, pausado, callback){

		var jsonm = '{"price":"'+price+'","available_quantity":"'+stock+'","status":"active"}';

		if(pausado){
		jsonm = '{"status":"paused"}';
		console.log(jsonm);
		}

		if(stock<=0){

			jsonm = '{"price":"'+price+'","available_quantity":"'+stock+'","status":"paused"}';

		}

		Request.put({
        "headers": { "Content-Type": "application/json" },
        "url": 'https://api.mercadolibre.com/items/'+destino_id+'?access_token='+meli_token,
        "body": jsonm

        }, (error, response, body) => {

        	if(response.statusCode != 200) {
    			let respuesta = JSON.parse(body);
    			
    			console.log(respuesta);

    			if(respuesta.status==409){
    				console.log("articulo locked: "+destino_id);
    			
    			}

    			callback(body,null);
    			
			}
			else {
				let respuesta = JSON.parse(body)
				//console.log("MLA Actualizado:"+respuesta.id);	
				
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


	function toFixedTrunc(value, n) {
	  const v = value.toString().split('.');
	  if (n <= 0) return v[0];
	  let f = v[1] || '';
	  if (f.length > n) return `${v[0]}.${f.substr(0,n)}`;
	  while (f.length < n) f += '0';
	  return `${v[0]}.${f}`
	}
	


}


