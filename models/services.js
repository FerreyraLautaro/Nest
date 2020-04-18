const mysql = require('mysql');

var connection = mysql.createConnection({multipleStatements: true});
connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'e5TBlg5FBOTbfWEP',
  database: 'api_auth'
});

let serviceModel = {};

serviceModel.get = (callback) => {
  if (connection) {
    connection.query('SELECT * FROM service ORDER BY id',
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

serviceModel.insert = (dataService, callback) => {
  if (connection) {
    connection.query('INSERT INTO service SET ?', dataService,
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

serviceModel.update = (dataService, callback) => {
  if (connection) {
    const sql = `
      UPDATE service SET
      company_id = ${connection.escape(dataService.company_id)},
      platform_id = ${connection.escape(dataService.platform_id)},
      credential = ${connection.escape(dataService.credential)},
      active = ${connection.escape(dataService.active)},
      date_add = ${connection.escape(dataService.date_add)},
      date_upd = ${connection.escape(dataService.date_upd)}

      WHERE id = ${dataService.id}`;

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


serviceModel.deleteService = (id, callback) => {
  if (connection) {
    var sqlExists = `
      SELECT * FROM service WHERE id = ${connection.escape(id)}
    `;
    connection.query(sqlExists, (err, row) => {
      if (row) {
        var sql = `DELETE FROM service WHERE id=` + connection.escape(id);
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



module.exports = serviceModel;