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
		      		if(data[i].name =='manufacturer_round')
	      			var manufacturer_round = data[i].value;
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

				getProducts(protocol,address,version,dataItem.origin_id,warehouse_list, token, function(err, resp){

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

							if(productos[p].ID_ARTICULO == dataItem.origin_id){

								//console.log("id igual: "+resp.Products[p].ID_ARTICULO);
								var price = toFixedTrunc(productos[p].PRECIOVENTA*productos[p].COTIZACIONMONEDA,2);
								if(productos[p].PRECIOPROMOCION != 0){
									price = toFixedTrunc(productos[p].PRECIOPROMOCION*productos[p].COTIZACIONMONEDA,2);
								}

								if(dataItem.id_service == 4)
								{
									price = toFixedTrunc((productos[p].PRECIOVENTA*productos[p].COTIZACIONMONEDA)*productos[p].COEFICIENTEIVA,2);
									if(productos[p].PRECIOPROMOCION != 0){
									price = toFixedTrunc(productos[p].PRECIOPROMOCION*productos[p].COTIZACIONMONEDA*productos[p].COEFICIENTEIVA,2);
									}
								}

								if(manufacturer_round){
									if(manufacturer_round.indexOf(productos[p].CODIGO_MARCA) != -1){

										price = Math.round10(price);

									}	
								}

								
								var stock = productos[p].STOCKTOTALDEPOSITO;
								if(stock < 0){
									stock = 0;
								}

								var usaTalle = productos[p].TALLES;

								var superRubro = productos[p].DESCRIPCION_CATEGORIA.split(' ', 1);
								var nombreProducto = productos[p].DESCRIPCION_CATEGORIA.split(' ', 1) + ' ' + productos[p].DESCRIPCION_MARCA + ' ' +productos[p].NOMBRE;
								var nombreC = productos[p].NOMBRE.substring(0, 59);
							}

						}

						var jsonCateg = JSON.stringify([{"title": nombreProducto, "price": price}]);
						
						postCategoryPred(jsonCateg, function(err, prediction){

							if(prediction){

						
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

								//console.log(jsonMeli);

								// var jsonMeli = JSON.stringify({
								// "title":nombreProducto,
								// "category_id":categoriaPred,
								// "price":price,
								// "currency_id":"ARS",
								// "condition":"new",
								// "available_quantity":stock,
								// "buying_mode":"buy_it_now",
								// "listing_type_id":"bronze",
								// "description": "esta es una descripcion del producto",
								// "pictures":[
								// 		{"source":"http://valmy.com/clubvalmy/wp-content/plugins/smg-theme-tools/public/images/not-available-es.png"}
								// 	]
								// });


								publiMeli(jsonMeli, meli_access_token, function(err, publi){

									if(publi){

										var relationData = {
									      id: null,
									      date_add: null,
									      date_upd: null,
									      destination_id: publi.id,
									      integration_id: 1,
									      model_id: 1,
									      origin_id: dataItem.origin_id,
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


							}//if prediction
						
						});//postCategoryPred


					}//if resp	

				});//getProducts

			}//if data

	      });//getparamsID
    
  	});//post item



	function getProducts(protocol,address, version, origin_id, warehouse_list, token, callback){

		//fallas.push({"origin_id":origin_id});
		//console.log(fallas);

		//console.log('http://'+address+'/'+version+'/products/'+origin_id+'?warehouse_list='+warehouse_list);
		//console.log(origin_id);         products/009076?warehouse_list=003

		var options = {
	        url: protocol+'://'+address+'/'+version+'/products?id='+origin_id+'&warehouse_list='+warehouse_list,
	          headers: {
	            'Authorization': 'Bearer '+token,
	            'Connection': 'close'
	          }

	    };

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
}
