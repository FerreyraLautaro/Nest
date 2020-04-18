const mysql = require('mysql');

connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'e5TBlg5FBOTbfWEP',
  database: 'api_auth'
});

let roleModel = {};

roleModel.getRoles = (callback) => {
  if (connection) {
    connection.query('SELECT * FROM role ORDER BY id',
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

roleModel.insertRoles = (rolData, callback) => {
  if (connection) {
    connection.query('INSERT INTO role SET ?', rolData,
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

roleModel.updateRol = (rolData, callback) => {
  if (connection) {
    const sql = `
      UPDATE role SET
      name = ${connection.escape(rolData.name)},
      type = ${connection.escape(rolData.type)}
      WHERE id = ${rolData.id}`;

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


roleModel.deleteRol = (id, callback) => {
  if (connection) {
    var sqlExists = `
      SELECT * FROM role WHERE id = ${connection.escape(id)}
    `;
    connection.query(sqlExists, (err, row) => {
      if (row) {
        var sql = `DELETE FROM role WHERE id=` + connection.escape(id);
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



module.exports = roleModel;