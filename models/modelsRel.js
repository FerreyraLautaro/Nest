const mysql = require('mysql');

var connection = mysql.createConnection({multipleStatements: true});
connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'e5TBlg5FBOTbfWEP',
  database: 'client_test_relations'
});

let relationModel = {};

relationModel.getModel = (callback) => {
  if (connection) {
    connection.query('SELECT * FROM model ORDER BY id',
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

relationModel.insertModel = (  modelData, callback) => {
  if (connection) {
    connection.query('INSERT INTO model SET ?', modelData,
      (err, result) => {
        if (err) {
          throw err;
        } else {
          callback(null, {'insertId': result.insertId})
        }
      }
    )
  }
};

relationModel.updateModel = (modelData, callback) => {
  if (connection) {
    const sql = `
      UPDATE model SET
      last_success_sync = ${connection.escape(modelData.last_success_sync)},
      name = ${connection.escape(modelData.name)}
      WHERE id = ${modelData.id}`;

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

relationModel.deleteModel = (id, callback) => {
  if (connection) {
    var sqlExists = `
      SELECT * FROM model WHERE id = ${connection.escape(id)}
    `;
    connection.query(sqlExists, (err, row) => {
      if (row) {
        var sql = `DELETE FROM model WHERE id=` + connection.escape(id);
        connection.query(sql, (err, result) => {
          if (err) {
            throw err;
          } else{
            callback(null, {
              "msg": "model Borrado"
            });
          }
        });
      } else {
        callback(null, {
          "msg": "no existe el Model que desea borrar, o su ID no coincide"
        });
      }
    });
  }
}

module.exports = relationModel;
