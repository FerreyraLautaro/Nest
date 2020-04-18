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

let o2oProvince = {};

o2oProvince.gets2s = (datab, callback) => {

config.database = datab.database;
connection = mysql.createConnection(config);

  if (connection) {
    connection.query('SELECT * FROM relations_clients ORDER BY origin_id',
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


// o2oProvince.inserto2o = (orderData, callback) => {

// config.database = orderData.database;
// var origin_id = orderData.origin_id;
// var destination_id = orderData.destination_id;
// var accomplished = orderData.accomplished;
// var date_add = orderData.date_add;
// var date_upd = orderData.date_upd;

// connection = mysql.createConnection(config);
//   if (connection) {
//     connection.query('INSERT INTO relations_clients (origin_id, destination_id, accomplished) values ("'+origin_id+'", "'+destination_id+'", '+accomplished+')',
//       (err, result) => {
//         if (err) {
//           throw err;
//         } else{ 
//           callback(null, result)
//         }
//       }
//     )
//  }
// };


o2oProvince.getProvince = (data, callback) => {

config.database = data.database;
var origin_id = data.origin_id;
var connection = mysql.createConnection(config);

  if (connection) {
    connection.query('SELECT * FROM relations_provinces WHERE origin_id ="'+origin_id+'"',
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


// o2oProvince.updateClient = (dataClient, callback) => {
  
// config.database = dataClient.database;
// var connection = mysql.createConnection(config);

//   if (connection) {
//     const sql = `
//       UPDATE relations_clients SET
//       destination_id = ${connection.escape(dataClient.destination_id)},
//       accomplished = ${connection.escape(dataClient.accomplished)}
      
//       WHERE Id = ${dataClient.id}`;

//     connection.query(sql, function (err, result) {
//       if (err) {
//         throw err;
//       } else {
//         callback(null, {
//           "msg": "success"
//         })
//       }
//     });
//   }
// };




module.exports = o2oProvince;