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

let relationClient = {};

relationClient.getRelation = (datab, callback) => {

config.database = datab.database;
connection = mysql.createConnection(config);

  if (connection) {
    connection.query('SELECT * FROM relation ORDER BY id',
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


relationClient.getOriginID = (id, callback) => {

config.database = id.database;
connection = mysql.createConnection(config);

  if (connection) {
   var idd = connection.escape(id.id);

   var sql = `SELECT * FROM relation WHERE origin_id=` + idd;
   //console.log(connection.escape(id));
    connection.query(sql,
      (err, data) => {
        if (err) {
          throw err
        }
        else {
          callback(null, data);
        }
      }
    )
  }
};

relationClient.getDestinationID = (destination_id, callback) => {

config.database = destination_id.database;
connection = mysql.createConnection(config);

var destination_idd = destination_id.destination_id;

  if (connection) {
   //var id = connection.escape(id);
   var sql = `SELECT * FROM relation WHERE destination_id=` + "'"+destination_idd+"'";
//   console.log(sql);
    connection.query(sql,
      (err, data) => {
        if (err) {
          throw err
        }
        else {
          callback(null, data[0]);
        }
      }
    )
  }
};

relationClient.getSearchOriginID = (relationData, callback) => {

config.database = relationData.database;
connection = mysql.createConnection(config);

  if (connection) {
    connection.query('CALL MTO_SEARCHINRELATION(?, ?)', [relationData.integration_id, relationData.destination_id],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          callback(null, result[0])
        }
      }
    )
  }
};




relationClient.insertRelation = (relationData, callback) => {

config.database = relationData.database;
connection = mysql.createConnection(config);
  if (connection) {
    connection.query('CALL MTO_INSERTORUPDATERELATION(?, ?, ?, ?, ?, ?, ?,@_SALIDA)', [relationData.id, relationData.integration_id, relationData.model_id, relationData.origin_id, relationData.destination_id, relationData.date_add, relationData.date_upd],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          //console.log(result[0]);
          callback(null, result[0])
        }
      }
    )
  }
};

relationClient.updateRelation = (relationData, callback) => {

config.database = relationData.database;
connection = mysql.createConnection(config);

  if (connection) {
    const sql = `
      UPDATE relation SET
      date_add = ${connection.escape(relationData.date_add)},
      date_upd = ${connection.escape(relationData.date_upd)},
      destination_id = ${connection.escape(relationData.destination_id)},
      integration_id = ${connection.escape(relationData.integration_id)},
      model_id = ${connection.escape(relationData.model_id)},
      origin_id = ${connection.escape(relationData.origin_id)}
      WHERE id = ${relationData.id}`;

    connection.query(sql, function (err, result) {
      if (err) {
        throw err;
      } else {
        callback(null, {
          "msg": "success"
        })
      }
    });
  }
};

relationClient.deleteRelation = (id, callback) => {

config.database = id.database;
connection = mysql.createConnection(config);

var idd = id.id;

  if (connection) {
    var sqlExists = `SELECT * FROM relation WHERE id =` + idd;
    console.log(sqlExists);
    connection.query(sqlExists, (err, row) => {
      if (row) {
        var sql = `DELETE FROM relation WHERE id=` + idd;
        console.log(sql);
        connection.query(sql, (err, result) => {
          if (err) {
            throw err;
          } else{
            callback(null, {
              "msg": "deleted"
            });
          }
        });
      } else {
        callback(null, {
          "msg": "not Exists"
        });
      }
    });
  }
}

module.exports = relationClient;
