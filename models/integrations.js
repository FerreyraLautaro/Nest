const mysql = require('mysql');

connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'e5TBlg5FBOTbfWEP',
  database: 'api_auth'
});

let integrationModel = {};

integrationModel.get = (callback) => {
  if (connection) {
    connection.query('SELECT * FROM integration ORDER BY id',
      (err, rows) => {
        if (err) {
          throw err;
        }
        else {
          callback(null, rows);
        }
      }
    )
  }
};

integrationModel.insert = (integrationData, callback) => {
  if (connection) {
    connection.query('INSERT INTO integration SET ?', integrationData,
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

integrationModel.update = (integrationData, callback) => {
  if (connection) {
    const sql = `
      UPDATE integration SET
      origin_service_id = ${connection.escape(integrationData.origin_service_id)},
      destination_service_id = ${connection.escape(integrationData.destination_service_id)}
      WHERE id = ${integrationData.id}`;

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


integrationModel.deleteIntegration = (id, callback) => {
  if (connection) {
    var sqlExists = `
      SELECT * FROM integration WHERE id = ${connection.escape(id)}
    `;
    connection.query(sqlExists, (err, row) => {
      if (row) {
        var sql = `DELETE FROM integration WHERE id=` + connection.escape(id);
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



module.exports = integrationModel;