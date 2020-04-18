var Request = require('request');

const fs =require('fs');
const Parameters = require('../models/parameters');
const ModelRelationRel = require('../models/relationsRel');


var fallas = [];
var actualizado = [];

var socket =[];


module.exports = function(app){


	//app.post('/sincro/id_service=:id_service&database=:database&mode=:mode', (req, res) => {
	app.get('/sincro/id_service=:id_service&database=:database&mode=:mode', (req, res) => {
	    	
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
	      		if(data[i].name =='update_from')
	      			var update_from = data[i].value;
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
							    if(data) 
							    {
							        console.log("token guardado");
							        //console.log(serviceData.database);
							        
							        //var datab = { database: serviceData.database};		
							        
							        var address = ip_api_flx;
									if(port != ''){
										address = ip_api_flx+':'+port;
									}
							        
							        actualizado =[];
									fallas =[];

							        getAllProducts(address, version, warehouse_list, update_from, token, serviceData.id_service, function(err,dataProd){

							        	if(dataProd)
							        	{
							        		console.log("trajo productos");
							        		//console.log(dataProd);

							        		if(typeof dataProd.Products === "undefined" ){
												var Products = dataProd.data;
												//console.log("usa data");
											}
											else{
												var Products = dataProd.Products;
												//console.log("usa resp.Products");
											}

											if(Products[0] == null){
												console.log("no hay productos");

												res.status(200).json({
										          success: true,
										          msg: "no hay productos"
										        });
											}

								        	
								        	dataProd.Products.forEach((producto,i)=>{

								        		//console.log("cada producto");
								        		var datab = { database: serviceData.database,
								        					   id: producto.ID_ARTICULO };

								        		ModelRelationRel.getOriginID(datab, (err, dataRel) => {

								        			if(dataRel[0]){

								       					console.log(dataRel[0].destination_id);

								       					var destination_id = dataRel[0].destination_id;

								       					var price = toFixedTrunc(producto.PRECIOVENTA*producto.COTIZACIONMONEDA,2);
														if(producto.PRECIOPROMOCION != 0){
															price = toFixedTrunc(producto.PRECIOPROMOCION*producto.COTIZACIONMONEDA,2);
														}
														var stock = producto.STOCKTOTALDEPOSITO;
														if(stock < 0){
															stock = 0;
														}

														actualizado.push("\r\nSe Actualizo: "+destination_id+ " Price: "+ price+ " Stock: "+stock );
														
														//llamada a funcion put a ML
														putMeli(destination_id, price, stock, meli_token, function(err, response){

															if(response){
																//let r =JSON.parse(response);
																//console.log(response);
																
																console.log("Se Actualizo: "+response.id+ " Price: "+ response.price+ " Stock: "+response.available_quantity+ " id_service:"+serviceData.id_service );
																
															}
															else{

																let error = JSON.parse(err);
																console.log(error.message);
																console.log("Error - destination_id:"+destination_id+ " price:"+price);

																fallas.push(JSON.stringify({"MLA":destination_id,"price":price,"error":error.message}));
																//fallas.push("\r\nError - destination_id:"+producto.destination_id+ " price:"+price);

																
																fs.writeFile(__dirname+'/../Logs/Error/ErrorML-'+serviceData.id_service+'-'+serviceData.database+'.txt', fallas, function (err) {
																  if (err) throw err;
																  console.log('Archivo de Errores Guardado');
																});
																
															}

															if(dataProd.Products.length-1 == i){

																fs.writeFile(__dirname+'/../Logs/Sincros/Actualizacion-'+serviceData.id_service+'-'+serviceData.database+'.txt', actualizado, function (err) {
															  	if (err) throw err;
															  	console.log('Archivo de Actualizacion Guardado');
																});

																guardarFecha(serviceData.id_service);

																res.status(200).json({
															    success: true,
															    msg: "productos actualizados"
															    });
															
															}

														});//putmeli


								        			}//ifDataRel
								        			else{
								        				console.log("no existe en tabla relacion");

								        				if(dataProd.Products.length-1 == i){

																fs.writeFile(__dirname+'/../Logs/Sincros/Actualizacion-'+serviceData.id_service+'-'+serviceData.database+'.txt', actualizado, function (err) {
															  	if (err) throw err;
															  	console.log('Archivo de Actualizacion Guardado');
																});

																guardarFecha(serviceData.id_service);

																res.status(200).json({
															    success: true,
															    msg: "productos actualizados"
															    });

														}

								        				return;
								        			}
								       
								           		});//trae relacion si existe

								        	})//forEach

							        	}//if dataprod
							        	else{

							        		console.log(err);

							        	}
							        });//getAllProducts

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
    			
			}
			else {
				let respuesta = JSON.parse(body)
				//console.log("MLA Actualizado:"+respuesta.id);	
				
				callback(null,respuesta);
					
			}

		});
		
	}
	

	function getAllProducts(address, version, warehouse_list, update_from, token, id_service, callback){
		
		var options = {
	        url: 'http://'+address+'/'+version+'/products?warehouse_list='+warehouse_list+'&update_from='+update_from+'&limit=-1',
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
		   	console.log("Error consulta a Flexxus -> id_service="+id_service);
				   	
		   	var serviceDown="Error consulta a API Flexxus"+" error "+error+ " body  "+body;
			
				fs.writeFile(__dirname+'/../Logs/Error/ErrorFLX-'+id_service+'.txt', serviceDown, function (err) {
					  if (err) throw err;
					  //console.log('Archivo de Mala conexion Guardado');
				});
			      	
	   		callback(response,null);

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


	function guardarFecha(id_service){

		//var fecha = new Date().toISOString();
		var today = new Date();  
		var localoffset = -(today.getTimezoneOffset()/60);
		var destoffset = -6;

		var offset = destoffset-localoffset;

		var d = new Date( new Date().getTime() + offset * 3660 * 1000).toISOString().replace( /T/, " " ).replace( /Z/, " " );

		console.log(d);

		var dataParametro = {
	      id: null,
	      service_id: id_service,
	      name: "update_from",
	      value: d   
	    };

	    Parameters.insert(dataParametro, (err, data) => {
		    if(data) 
		    {
		    	console.log("fecha actualizada "+ d);

		    }
		});	

	}


}