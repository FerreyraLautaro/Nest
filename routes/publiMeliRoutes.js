const Request = require('request');
const fs =require('fs');

const Parameters = require('../models/parameters');
const ModelRelationRel = require('../models/relationsRel');


module.exports = function(app){

	app.post('/item', (req, res) => {
    var dataItem = {
      origin_id: req.body.origin_id,
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

								//console.log("id igual: "+resp.Products[p].ID_ARTICULO);
								var price = toFixedTrunc(productos[p].PRECIOVENTA*productos[p].COTIZACIONMONEDA,2);
								if(productos[p].PRECIOPROMOCION != 0){
									price = toFixedTrunc(productos[p].PRECIOPROMOCION*productos[p].COTIZACIONMONEDA,2);
								}


								if(manufacturer_round){

									console.log(manufacturer_round.indexOf(productos[p].CODIGO_MARCA));

									if(manufacturer_round.indexOf(productos[p].CODIGO_MARCA) != -1){

										price = toFixedTrunc(Number.parseFloat(price).toFixed(1),2);

										console.log("Precio Redondeado: " + price);
									}	
								}


								var stock = 0;
																
								if(typeOfStock == 1){
								stock = productos[p].STOCKTOTALDEPOSITO;
								}else if(typeOfStock == 2){
									stock = productos[p].STOCKREALDEPOSITO;
								}else{
									stock = productos[p].STOCKTOTAL;
								}

								if(stock <= 0 || stock == null){
									stock = 1;
								}

								var usaTalle = productos[p].TALLES;

								var superRubro = productos[p].DESCRIPCION_CATEGORIA.split(' ', 1);
								var nombreProducto = productos[p].DESCRIPCION_CATEGORIA.split(' ', 1) + ' ' + productos[p].DESCRIPCION_MARCA + ' ' +productos[p].NOMBRE;
								var nombreC = productos[p].NOMBRE.substring(0, 59);
								var referencia = productos[p].CODIGO_PRODUCTO;

								var id_articuloflx = productos[p].ID_ARTICULO;

								if(service2 == 1){
									nombreProducto = productos[p].DESCRIPCION_MARCA + ' ' +productos[p].NOMBRE;
									nombreC = productos[p].NOMBRE+' '+productos[p].DESCRIPCION_MARCA;
									nombreC = nombreC.substring(0, 59);
								}
							}

						}

						var jsonCateg = JSON.stringify([{"title": nombreProducto, "price": price}]);
						console.log(jsonCateg);
						
						postCategoryPred(jsonCateg, function(err, prediction){

							if(prediction){

						
								//console.log(prediction);

								for(var c = 0; c<prediction[0].path_from_root.length; c++){

									if( prediction[0].path_from_root.length - 1 == c)
										categoriaPred = prediction[0].path_from_root[c].id;

								}

								if(dataItem.id_service == 20)
								{
									if(category_default != ''){
										categoriaPred = category_default;
									}
								}

								if(dataItem.id_service == 2)
								{
									
									categoriaPred = 'MLA3090';
									
								}
								//categoriaPred = prediction[0].path_from_root[3].id;

								//console.log(categoriaPred);
								console.log(referencia);

								getPrestashopData(prestashop_url, referencia, function(err, dataPresta){

									//console.log(dataPresta);
									//console.log(dataPresta.length);

									var descripcion ='';
									var Color = 'Negro';

									if(dataPresta != null){
										
										var images = [];
										var imagesv =[];
										

										//dataPresta = JSON.stringify(dataPresta);

										for (var i = 0; i<dataPresta.length; i++){

											nombreC = dataPresta[i].title.substring(0, 59);

											if(dataPresta[i].color){
												Color = dataPresta[i].color;
											}

											descripcion = dataPresta[i].description_short;
											//images.push(prestashop_url + dataPresta[i].img);

											if(dataPresta[i].img != null)
											{
												images.push(JSON.parse('{"source":"'+prestashop_url + dataPresta[i].img+'"}'));
												imagesv.push(prestashop_url + dataPresta[i].img);
											}

										}
										//console.log(nombreC);
										console.log(dataPresta);

										//console.log(JSON.stringify(images));
										console.log(JSON.stringify(imagesv));
										

									}

									if( typeof images !== 'undefined' && images.length > 0)
									{
										var jsonMeli = JSON.stringify({
										"title":nombreC,
										"category_id":categoriaPred,
										"price":price,
										"currency_id":"ARS",
										"condition":"new",
										"description":{
													      "plain_text":descripcion
													   },
										"available_quantity":stock,
										"buying_mode":"buy_it_now",										
										"listing_type_id":"bronze",
										"pictures": images
										});
									}else{

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

									}
					


									if(usaTalle){

										if( typeof imagesv !== 'undefined' && imagesv.length > 0)
										{
											var jsonMeli = JSON.stringify({
											"title":nombreC,
											"category_id":categoriaPred,
											"price":price,
											"currency_id":"ARS",
											"condition":"new",
											"description":{
													      "plain_text":descripcion
													   },
											"available_quantity":stock,
											"buying_mode":"buy_it_now",
											"listing_type_id":"bronze",
											"variations":[  
		     									{  
													"attribute_combinations": [
												        {
												            "id": "COLOR",
											                "name": "Color",
											                "value_name": Color,
											            },
											            {
											                "id": "SIZE",
											                "name": "Talle",
											                "value_name": "10",
											            }
												    ],  
												    "price": price,
												    "available_quantity": 1,
												   	"picture_ids":imagesv

												}
											]

											});
									 
									 }else{

									 	var jsonMeli = JSON.stringify({
											"title":nombreC,
											"category_id":categoriaPred,
											"price":price,
											"currency_id":"ARS",
											"condition":"new",
											"available_quantity":stock,
											"buying_mode":"buy_it_now",
											"listing_type_id":"bronze",
											"variations":[  
		     									{  
													"attribute_combinations": [
												        {
												            "id": "COLOR",
											                "name": "Color",
											                "value_name": Color,
											            },
											            {
											                "id": "SIZE",
											                "name": "Talle",
											                "value_name": "10",
											            }
												    ],  
												    "price": price,
												    "available_quantity": 1,
												   	"picture_ids":[
		              									"https://devnode1.mitiendaonline.com/sin-foto.jpg"
		            								]

												}
											]

											});


									 }
									       
									}
									

									console.log(jsonMeli);
									

									publiMeli(jsonMeli, meli_access_token, function(err, publi){

										if(publi){

											var relationData = {
										      id: null,
										      date_add: null,
										      date_upd: null,
										      destination_id: publi.id,
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
											

											//console.log(publi.id);

											// res.status(200).json({
										 //    success: true,
										 //    msg: "publicacion exitosa"
										 //    });


										}//if publi
										if(err){

											//console.log(err.message);
											
											res.status(500).json({
										          success: false,
										          message: err
										    });


										}


									});//publiMeli



									// res.status(200).json({
							  		// success: true,
							          
							  		// });
								});//getPresta

							}//if prediction
						
						});//postCategoryPred


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


	function publiMeli(jsonMeli, meli_token, callback){

		Request.post({
        "headers": { "Content-Type": "application/json" },
        "url": 'https://api.mercadolibre.com/items?access_token='+meli_token,
        "body": jsonMeli
               
        }, (error, response, body) => {

        	if(response.statusCode != 200 && response.statusCode != 201) {
    			console.log(response.statusCode);

    			let respuesta = JSON.parse(body);

    			console.log(respuesta);
    			//console.log("MLA publicado pero statuscode != 200: "+respuesta.id);
    			
    			if(respuesta.status==409){
    				console.log("articulo locked: "+destino_id);
    			
    			}

    			callback(respuesta,null);

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


	  
	function getPrestashopData(address, reference, callback){

		//fallas.push({"origin_id":origin_id});
		//console.log(fallas);

		//console.log('http://'+address+'/'+version+'/products/'+origin_id+'?warehouse_list='+warehouse_list);
		//console.log(origin_id);         products/009076?warehouse_list=003

		var options = {
	        url: address+'/adminmto/getDatosProductos.php?referencia='+reference,
	          headers: {
	            'Content-Type': 'application/json'
	          }

	    };

	    //console.log(options);  
	
		function callback1(error, response, body) {
	       if (!error && response.statusCode == 200 ) {
	        
	        //console.log(body);
	        try {
				let resp = JSON.parse(body);
				callback(null,resp);
			}
	        catch(fail){
	        	callback(null,null);
	        }
	        //console.log(resp+"-"+destination_id);
	        
	        
		   
		   }
		   else{
		     
		   	//socket.push(origin_id);
		   	console.log("Error consulta a Presta");

		   	//let err = JSON.stringify(error);

		   	//console.log(error.code);
		   	
		   	if(error){
		   		

		   		console.log("fue error");
		   		
		   		callback(null,null);
		   		
		   	}
		   	else{

		   		
		      	console.log("no fue error pero no hubo exito");
		   		callback(null,null);

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