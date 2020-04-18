const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

var port = process.env.PORT || process.env.VCAP_APP_PORT || 4000;

const express = require('express');
const app = express();

//var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS

// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
//app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));
 

const morgan = require('morgan');
const bodyParser = require('body-parser');

var cors = require('cors');


//settings
//app.set('port', 4000);



//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());


//routes

require('./routes/rolesRoutes')(app);
require('./routes/companiesRoutes')(app);
require('./routes/userRoutes')(app);
require('./routes/platformRoutes')(app);
require('./routes/integrationRoutes')(app);
require('./routes/parameterRoutes')(app);
require('./routes/serviceRoutes')(app);
require('./routes/notificationsRoutes')(app);
require('./routes/authFlxRoutes')(app);
require('./routes/productsRoutes')(app);
require('./routes/warehouseRoutes')(app);
require('./routes/sincroRoutes')(app);
require('./routes/SincroTalles')(app);
require('./routes/publiMeliRoutes')(app);
require('./routes/sincroRoutesMasiva')(app);
require('./routes/sincroDeplanoRoutes')(app);
require('./routes/publiMeliMasiva')(app);
require('./routes/c2cRoutes')(app);
require('./routes/s2sRoutes')(app);
require('./routes/sincroOrders')(app);
require('./routes/publiRelation')(app);

//require('./routes/userRoutes/login')(app);

require('./routes/modelRelRoutes')(app);
require('./routes/relationRelRoutes')(app);

require('./routes/publiMeliRoutes')(app);

require('./routes/o2oRoutes')(app);



app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,content-type, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

   // Pass to next layer of middleware
    next();
});


//static files

var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/devnode1.mitiendaonline.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/devnode1.mitiendaonline.com/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/devnode1.mitiendaonline.com/chain.pem')
};


https.createServer(options, app).listen(port);

//app.listen(app.get('port'), () =>{

//console.log(app.get('port'));

//});
