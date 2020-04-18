const mysql = require('mysql');


var config = {  
        host: 'localhost',
        user: 'root',
        password: 'e5TBlg5FBOTbfWEP',
        database: 'default',
        multipleStatements: true
};

/*var connection = mysql.createConnection({multipleStatements: true});
connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'e5TBlg5FBOTbfWEP',
  database: 'client_test_relations'
});*/

let o2oClient = {};

o2oClient.geto2o = (datab, callback) => {

config.database = datab.database;
connection = mysql.createConnection(config);

  if (connection) {
    connection.query('SELECT * FROM relations_orders ORDER BY origin_id',
      (err, rows) => {
        if (err) {
          throw err
        }
        else {
          callback(null, rows);
        }
      }
    )
  }
};


o2oClient.inserto2o = (orderData, callback) => {

config.database = orderData.database;
var origin_id = orderData.origin_id;
var destination_id = orderData.destination_id;
var accomplished = orderData.accomplished;
var date_add = orderData.date_add;
var date_upd = orderData.date_upd;

connection = mysql.createConnection(config);
  if (connection) {
    connection.query('INSERT INTO relations_orders (origin_id, destination_id, accomplished, date_add, date_upd) values ('+origin_id+', '+destination_id+', '+accomplished+', '+date_add+', '+date_upd+')',
      (err, result) => {
        if (err) {
          throw err;
        } else{ 
          callback(null, result)
        }
      }
    )
 }
};


o2oClient.getOrder = (data, callback) => {

config.database = data.database;
var origin_id = data.origin_id;
var connection = mysql.createConnection(config);

  if (connection) {
    connection.query('SELECT * FROM relations_orders WHERE origin_id ="'+origin_id+'"',
      (err, rows) => {
        if (err) {
          throw err
        }
        else {
          callback(null, rows);
        }
      }
    )
  }
};




module.exports = o2oClient;