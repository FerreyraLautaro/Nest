const mysql = require('mysql');

connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'e5TBlg5FBOTbfWEP',
  database: 'api_auth'
});

let platformModel = {};

platformModel.getPlatforms = (callback) => {
  if (connection) {
    connection.query('SELECT * FROM platform ORDER BY id',
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

platformModel.insertPlatforms = (platformData, callback) => {
  if (connection) {
    connection.query('INSERT INTO platform SET ?', platformData,
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

platformModel.updatePlatforms = (platformData, callback) => {
  if (connection) {
    const sql = `
      UPDATE platform SET
      name = ${connection.escape(platformData.name)},
      credential_template = ${connection.escape(platformData.type)}
      WHERE id = ${platformData.id}`;

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


platformModel.deletePlatform = (id, callback) => {
  if (connection) {
    var sqlExists = `
      SELECT * FROM platform WHERE id = ${connection.escape(id)}
    `;
    connection.query(sqlExists, (err, row) => {
      if (row) {
        var sql = `DELETE FROM platform WHERE id=` + connection.escape(id);
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



module.exports = platformModel;