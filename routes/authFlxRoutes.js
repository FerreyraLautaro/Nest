const Request = require('request');
const Parameters = require('../models/parameters');


module.exports = app => {

//login con API FLX del cliente

app.post('/auth/login', (req, res) => {
    var userData = {      
      username: req.body.username,
      password: req.body.password,
      ip_api: req.body.ip_api_flx,
      service_id: req.body.service_id,
      protocolo: req.body.protocol,
      port: req.body.port,
      ver: req.body.ver
    };

    //console.log(userData);

    var address = userData.ip_api;
    if(userData.port != '')
    {
      address = userData.ip_api+':'+userData.port;
    }

    //console.log(userData.protocolo+'://'+ address + '/'+userData.ver+'/auth/login');
    //console.log('username='+ userData.username +'&password='+ userData.password+'&deviceinfo={"model":"0","platform":"0","uuid":"4953457348957348975","version":"0","manufacturer": "0"}');
    //console.log("login");
    Request.post({
            "headers": { "Content-Type": "application/x-www-form-urlencoded" },
            "url": userData.protocolo+'://'+ address + '/'+userData.ver+'/auth/login',
            "body": 'username='+ userData.username +'&password='+ userData.password+'&deviceinfo={"model":"0","platform":"0","uuid":"4953457348957348975","version":"0","manufacturer": "0"}'
                   
            }, (error, response, body) => {

              //console.log(error, response, body);            
                
                if(error || response.statusCode != 200) {
                    let resp = JSON.parse(body);
                    //let resp = body;
                    //console.log(resp);
                    //callback(JSON.parse(body),null)
                    res.status(404).json({
                    success: false,
                    msg: "Login Falso",
                       data: "error"
                     });
                }
                else {
                    let resp = JSON.parse(body); 
                    //console.log(resp);
                    
                    var dataParameter = {
      					      id: null,
      					      service_id: userData.service_id,
      					      name: 'token',
      					      value: resp.token   
      					    };
                    //console.log(dataParameter);
          					Parameters.insert(dataParameter, (err, data) => {
          					      if (data) {
          					        //console.log(data);
          					        console.log("token guardado");
          					      } else {
          					        console.log("error guardando el token");
          					      }
          					    });    

                        res.status(200).json({
                        success: true,
                        msg: "Login Correcto",
                        token:resp.token,
                        data: resp
                        });               
                }
            }
      );
  

  });




};
