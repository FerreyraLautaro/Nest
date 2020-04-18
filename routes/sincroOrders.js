const Request = require('request');

const fs =require('fs');
const Parameters = require('../models/parameters');
const ModelRelationRel = require('../models/relationsRel');
const o2oOrders = require('../models/o2oRel');
const o2oClient = require('../models/c2cRel');
const s2sState = require('../models/s2sRel');

var fallas = [];
var actualizado = [];

module.exports = function(app){

	app.get('/orders/id_service=:id_service&database=:database&mode=:mode', (req, res) => {
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
	      		if(data[i].name =='meli_user_orders')
	      			var meli_user_orders = data[i].value;
	      		if(data[i].name =='order_list_price')
	      			var order_list_price = data[i].value;
	      		if(data[i].name =='order_warehouse')
	      			var order_warehouse = data[i].value;
	      		if(data[i].name =='order_payment_method')
	      			var order_payment_method = data[i].value;
	      		if(data[i].name =='order_seller_id')
	      			var order_seller_id = data[i].value;
	      		if(data[i].name =='order_seller_username')
	      			var order_seller_username = data[i].value;
	      		if(data[i].name =='order_currency')
	      			var order_currency = data[i].value;
	      		if(data[i].name =='order_operation')
	      			var order_operation = data[i].value;
	      		if(data[i].name =='order_fechadesde')
	      			var order_fechadesde = data[i].value;
	      		
	       	}

	       	var address = ip_api_flx;
			if(port != ''){
				address = ip_api_flx+':'+port;
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
							        		
							        
							        getOrdersMeli(meli_user_orders, meli_access_token, function(err, resOrdenes){

							        	var ordenes = resOrdenes.results;
							        	
							        	if(ordenes){

							        		var datab = { database: serviceData.database};
							        
									        o2oOrders.geto2o(datab, (err, relacionado) => {
																					      												
												if(relacionado){
																							 
													console.log("trajo relaciones");
													//console.log(data);

													relacionado.forEach((datarel, d)=>{

														ordenes.forEach((ordMeli, o)=>{

															var fecha_creado = new Date(ordMeli.date_created);
															var fechaparametro = new Date(order_fechadesde);
															fecha_creado.setHours(fecha_creado.getHours() + 3);
															fecha_creado = fecha_creado.toLocaleString().replace(/[/]/g, "-");

															fechaparametro.setHours(fechaparametro.getHours() + 3);
															fechaparametro = fechaparametro.toLocaleString();
															
															//console.log(fecha_creado+' y '+fechaparametro);

															// if(fechaparametro < fecha_creado)
															// console.log(fecha_creado);

															if( ordMeli.id == datarel.origin_id || ordMeli.status!= "paid" )
													      	{
													        	
													        	ordenes.splice(o, 1);
													  													      	
													      	}

														});

													});

													console.log("cantidad de pedidos para sincronizar: " + ordenes.length);										

													
													ordenes.forEach((pedido, p)=>{

														var fechaPedido = new Date(pedido.date_created);
														fechaPedido.setHours(fechaPedido.getHours() + 3);
														fechaPedido = fechaPedido.toLocaleString().replace(/[/]/g, "-");

														var dataClient = { database: serviceData.database, origin_id : pedido.buyer.id};
														console.log("id_buyer: "+pedido.buyer.id);

														//busca si el cliente ya esta sincronizado
														o2oClient.getOrder(dataClient, (err, clientExist) => {
													
															if(clientExist[0] != null){
																//console.log(clientExist);
																//console.log("cliente-sincro: "+clientExist[0].destination_id);
																id_clienteFlx= clientExist[0].destination_id;
															}//if existe cliente
															else{

																console.log("cliente no esta relacionado");
																id_clienteFlx= "";

															}//else no esta relacionado

														
													
															getDataClientMeli(pedido.buyer.id, function(err, resAddressClient){

															//console.log(resAddressClient.address.state);
																if(resAddressClient.address.state == null)
															    {resAddressClient.address.state = 'AR-G' } 

																var dataState = {database: serviceData.database, origin_id: resAddressClient.address.state}
																// console.log(dataState);
																// console.log(resAddressClient.address.state);

																s2sState.getProvince(dataState, (err, dataProv) => {
															      //console.log(resAddressClient.address.state);  

															     	if(dataProv){

															     		 if(pedido.buyer.phone == null){
															     		 	
															     		 	var telefono = "000";
															     		 }else{

															     		 	var telefono = pedido.buyer.phone.area_code + pedido.buyer.phone.number;
															     		 }
															     		
															     		//console.log(dataProv);
																        var customer = {
																			id: id_clienteFlx,
																			document_id: pedido.buyer.billing_info.doc_number || "0",
																		    vat_number: "0",
																		    sales_tax_group_id: "CF",
																		    name: pedido.buyer.first_name + pedido.buyer.last_name,   
																		    state_id: dataProv[0].destination_id,
																		    city: resAddressClient.address.city || "Córdoba",
																		    zipcode: pedido.shipping.zip_code || "5000",
																		    neighborhood: "",
																		    address: pedido.shipping.street_name + pedido.shipping.street_number ||  "S/N",
																		    phone: telefono || "000",
																		    email: pedido.buyer.email || "",
																		    cell_phone: "",
																		    notes: "Mercado Libre: " + pedido.buyer.id
																		}
																		//////DATOS CLIENTE//////////
																		//console.log(dataClient);

																		var products = [];
																		

																		pedido.order_items.forEach((articuloml, e)=>{

																			//console.log("foreach por cada articulo");

																			dataArt ={database: serviceData.database, destination_id: articuloml.item.id};

																			console.log("MLA articulo: "+ articuloml.item.id);
																			
																			ModelRelationRel.getDestinationID(dataArt, (err, respArt) => {

																				//console.log("ya busco datos articulos");
																				if(respArt){

																					console.log("id_articulo: "+ respArt.origin_id);
																					//busca iva productos
																					getProducts(address,version,respArt.origin_id,warehouse_list, token, serviceData.id_service, serviceData.database, function(err, respIva){

																						//console.log(respIva);

																						//busco el talle de la compra si es q existe un talle
																						var size = null;
																						if(articuloml.item.variation_attributes != null)
																						{

																							for(var i = 0; i< articuloml.item.variation_attributes.length; i++){

																								if(articuloml.item.variation_attributes[i].name == 'Talle' )
																									size = articuloml.item.variation_attributes[i].value_name
																							}

																						}

																						//console.log(size);

																						var productos = {
																							"product_id":respArt.origin_id,
																							"size": size,
																							"quantity":articuloml.quantity,
																							"netPrice" :articuloml.unit_price / respIva,
																							"totalPrice" :articuloml.quantity*(articuloml.unit_price/respIva),
																							"discount": 0
																						}

																						

																						products.push(productos);
																						//console.log(products);

																						if(pedido.order_items.length-1 == e){
																						//console.log(itemsCuerpo);


																							var cart = { 
																								"cart":{
																									"number":0,
			      																					"total":pedido.total_amount,
			      																					customer,
			      																					products,
			      																					"notes": "Mercado Libre Pedido: "+pedido.id,
																							      	"price_list_id":order_list_price,
																									"currency_id":"PESOS",
																									"general_discount":0,
																									"username":order_seller_username,
																									"user_id":order_seller_id,
																									"warehouse_id":order_warehouse,
																									"type":order_operation,
																									"date":fechaPedido,
																									"payment_method_id":0
			      																				}
			      																			}
																							
																							var totalCarrito = pedido.total_amount;
			      																			//console.log(JSON.stringify(cart));
																							
																							setTimeout( function (p) {postOrderFlx(protocol,address,version,JSON.stringify(cart),token,function(error, respInsertOrder){

																								if(respInsertOrder){
																									//console.log(respInsertOrder);

																									var orderToRel = {
																										origin_id: pedido.id,
																										destination_id: respInsertOrder.orderId,
																										accomplished: 1,
																										date_add: null,
																										date_upd: null,
																										database: serviceData.database};

																									//inserta relacion orden	
																									o2oOrders.inserto2o(orderToRel, (err, orderRelacionada) => {
																								      
																								      	if (orderRelacionada) {
																								        console.log("relacion de pedidos guardada ");
																								      																								      
																								        console.log("id_cliente: "+id_clienteFlx);
																									        if(id_clienteFlx == ""){

																									        	var clienteRelacionar = {
																											      origin_id: pedido.buyer.id,
																											      destination_id: respInsertOrder.customer.internal_id,
																											      accomplished: 1,
																											      date_add: null,
																											      date_upd: null,
																											      database: serviceData.database
																											    };
																									        	//inserta cliente creado si no estaba sincronizado
																									        	o2oClient.inserto2o(clienteRelacionar, (err, clientSave) => {
																											      if (clientSave) {
																											     		if(ordenes.length-1 == p){
																											     		//     res.status(200).json({
																													   	//      success: true,
																													   	//      msg: "Inserto pedido/s"
																																 // });
																												        }
																											      } else {
																											        res.status(500).json({
																											          success: false,
																											          msg: "Error"
																											        });
																											      }
																											    });//inserta relacion cliente

																									        }

																									        var infoPedido ={ "cliente": serviceData.database, "monto": totalCarrito, "ML": 1};
																									        
																									        postContadorPedidos(JSON.stringify(infoPedido),function(error, respEstadistica){

																									        	if(ordenes.length-1 == p){

																									        	     res.status(200).json({
																											          success: true,
																											          msg: "Inserto pedido/s"
																													 });

																											        }

																									        });
																									      			
																									        
																								      	} 
																								      	else {
																								        
																								      	console.log("error guardando relacion pedido insertado");

																								      }
																								    });//guarda relacion orden


																								}//if respInsertOrder
																								else{
																									console.log(error);
																								}


																							})}, 4000 * p, p);//post order FLX 


																						}//if es el ultimo item del cuerpo

																				
																					});//trae iva producto	


																				}else{

																					console.log("no hay datos en la tabla Model-relation del articulo");
																					return;

																				}//respArt

																			
																			});//trae ID_ARTICULO

																		});//postorderFlx;//foreach items pedido


																		//console.log(itemsCuerpo);


															    	}//if dataprov

															    });//relacion provincia

															});//getDataClientMeli
														
														});//revisa si existe cliente sincronizado

													});//foreach Ordenes

													if(ordenes.length == 0)
													{

														res.status(200).json({
											          	success: true,
											         	 msg: "No hay pedidos en estado pagado para sincronizar"
											        	});


													}

												}//if data relaciones
												else{
													res.status(500).json({
										          	success: false,
										         	 msg: "error tabla relation"
										        	});
												
												}//if else de traer relaciones
									      		
									    	});	//trae relaciones orders



							        	}//if resp orders

							        
							        });//getordersmeli

							      						      

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


		

	function getOrdersMeli(users_meli_ids, meli_access_token, callback){

		//https://api.mercadolibre.com/items/MLA747366712/variations
		var options = {
	        url: 'https://api.mercadolibre.com/orders/search?seller='+users_meli_ids+'&sort=date_desc&access_token='+meli_access_token
	    };  


	    function callback2(error, response, body) {
	       if (!error && response.statusCode == 200) {
	        
	        //console.log(body);
	        let respOrders = JSON.parse(body);
	        //console.log(resp+"-"+destination_id);
	        
	        callback(null,respOrders);
		   
		   }
		   else{
		     
			   	//socket.push(origin_id);
			   	console.log("Error consultando orders a MELI");

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


	function getDataClientMeli(buyer_meli, callback){

		//https://api.mercadolibre.com/items/MLA747366712/variations
		var options = {
	        url: 'https://api.mercadolibre.com/users/'+buyer_meli
	    };  

	    function callback2(error, response, body) {
	       if (!error && response.statusCode == 200) {
	        
	        //console.log(body);
	        let respClient = JSON.parse(body);
	        //console.log(resp+"-"+destination_id);
	        
	        callback(null,respClient);
		   
		   }
		   else{
		     
			   	//socket.push(origin_id);
			   	console.log("Error consultando cliente a MELI");

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

	function postOrderFlx(protocol,address,version,cart,token, callback){

		Request.post({
        "headers": { "Content-Type": "application/json", 
    					"Authorization": "Bearer "+token},
        "url": protocol+'://'+address+'/'+version+'/orders',
        "body": cart
               
        }, (error, response, body) => {

        	if(response.statusCode != 200 && response.statusCode != 201) {
    			console.log(body);
    			
    			let respuesta = JSON.parse(body);
    			//console.log("MLA publicado pero statuscode != 200: "+respuesta.id);
    			
    			callback(body,null);

    			// res.status(500).json({
		        //   success: false,
		        //   producto: destination_id,
		        //   msg: respuesta
		        // });
			}
			else {
				let respuesta = JSON.parse(body)
				console.log("NP insertada:"+respuesta.orderId);	
				
				callback(null,respuesta);

				
				
			}

		});

		
	}

	function getProducts(address, version, origin_id, warehouse_list, token, id_service, database, callback){

		const options = {
	        url: 'http://'+address+'/'+version+'/products?id='+origin_id+'&warehouse_list='+warehouse_list,
	          headers: {
	            'Authorization': 'Bearer '+token,
	            'Connection': 'close'
	          }
	    };  
	
		function callback1(error, response, body) {
	       if (!error && response.statusCode == 200) {
	        	        
	        let resp = JSON.parse(body);

	        if(typeof resp.Products === "undefined" ){
			var producto = resp.data;
			//console.log("usa data");
			}
			else{
			var producto = resp.Products;
			//console.log("usa resp.Products");
			}

	        callback(null,producto[0].COEFICIENTEIVA);
		   
		   }
		   else{
	   	
		   	console.log("Error consultando IVA del producto a Flexxus -> id_service="+id_service);
		   	    		
	  		var serviceDown="Error consulta a API Flexxus"+" error "+error+ " body  "+body;
			
			fs.writeFile(__dirname+'/../Logs/Error/ErrorPedidoFLX-'+id_service+'-'+database+'.txt', serviceDown, function (err) {
				  if (err) throw err;
			});

			callback("Error",null);

		    }
	    }

      	Request(options, callback1);
		
	}


	function postContadorPedidos(infoPedido, callback){

		Request.post({
        "headers": { "Content-Type": "application/json"}, 
    	"url": "https://devnode1.mitiendaonline.com:4001/pedido",
        "body": infoPedido
               
        }, (error, response, body) => {

        	if(response.statusCode != 200) {
    			
    			let respuesta = JSON.parse(body);
    			
    			callback(body,null);
 			}
			else {
							
				callback(null,body);
			
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


