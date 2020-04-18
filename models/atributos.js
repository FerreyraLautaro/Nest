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

let atributes = {};

atributes.getAtributes = (datab, callback) => {

config.database = datab.database;
connection = mysql.createConnection(config);

  if (connection) {
    connection.query('SELECT * FROM atributos',
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


// atributes.getOrder = (data, callback) => {

// config.database = data.database;
// var origin_id = data.origin_id;
// var connection = mysql.createConnection(config);

//   if (connection) {
//     connection.query('SELECT * FROM relations_clients WHERE origin_id ="'+origin_id+'"',
//       (err, rows) => {
//         if (err) {
//           throw err
//         }
//         else {
//           callback(null, rows);
//         }
//       }
//     )
//   }
// };



module.exports = atributes;