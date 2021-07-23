// App core dependencies

const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { info } = require('_config/log');
// Initialize express app
const express = require('express');
const app = express();
// Load environment configuration from .env
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const environment = dotenv.config();
dotenvExpand(environment)


// Declare constants
const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || process.env.VCAP_APP_PORT || 4000;

// Setup Middleware
app.use(morgan('dev')); //Logger
app.use(bodyParser.json()); // Body Parser
app.use(cors()); // CORS

// Load routes
const routesPath = './routes/';
fs.readdirSync(routesPath).forEach(function (file) {
  let route = routesPath + file;
  require(route)(app);
});

// Setup Headers and CORS manually
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Website you wish to allow to connect
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  ); // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With,content-type, Accept'
  ); // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Credentials', true); // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
  next(); // Pass to next layer of middleware
});

// Load Environment and start server
switch (ENV) {
  case 'production':
    // Load SSL certification file
    const options = {
      key: fs.readFileSync(
        '/etc/letsencrypt/live/devnode1.mitiendaonline.com/privkey.pem'
      ),
      cert: fs.readFileSync(
        '/etc/letsencrypt/live/devnode1.mitiendaonline.com/cert.pem'
      ),
      ca: fs.readFileSync(
        '/etc/letsencrypt/live/devnode1.mitiendaonline.com/chain.pem'
      ),
    };
    // Launching Server
    https.createServer(options, app).listen(PORT);
    break;

  default:
    app.listen(PORT, () =>
      info(`Server listening at http://localhost:${PORT}`)
    );
    break;
}
