const mysql = require('mysql');
var connection = mysql.createConnection({multipleStatements: true});
connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'e5TBlg5FBOTbfWEP',
  database: 'api_auth'
});

let userModel = {};


userModel.loginUser = (userLogin, callback) => {
  if (connection) {

    const sql = `
    SELECT u.id, u.company_id, u.email, u.full_name, u.passwrd, u.role_id, s.id as service_id, p.value as ip_api_flx, c.cnn_relation_db  
    FROM user u, service s, parameter p, company c WHERE
    email = ${connection.escape(userLogin.email)} 
    AND passwrd = ${connection.escape(userLogin.passwrd)}
    AND u.company_id = s.id
    AND c.id = u.company_id 
    AND p.service_id = s.id
    AND p.name = 'ip_api_flx'`;

    connection.query(sql, (err, result) => {
        if (err) {
          throw err;
        } else {
          callback(null, result)
        }
      }
    )
  }
};


userModel.getUsers = (callback) => {
  if (connection) {
    connection.query('SELECT * FROM user ORDER BY id',
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

userModel.insertUser = (  userData, callback) => {
  if (connection) {
    connection.query('INSERT INTO user SET ?', userData,
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

userModel.updateUser = (userData, callback) => {
  if (connection) {
    const sql = `
      UPDATE user SET
      company_id = ${connection.escape(userData.company_id)},
      email = ${connection.escape(userData.email)},
      passwrd = ${connection.escape(userData.passwrd)},
      role_id = ${connection.escape(userData.role_id)}
      WHERE id = ${userData.id}`;

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

userModel.deleteUser = (id, callback) => {
  if (connection) {
    var sqlExists = `
      SELECT * FROM user WHERE id = ${connection.escape(id)}
    `;
    connection.query(sqlExists, (err, row) => {
      if (row) {
        var sql = `DELETE FROM user WHERE id=` + connection.escape(id);
        connection.query(sql, (err, result) => {
          if (err) {
            throw err;
          } else{
            callback(null, {
              "msg": "Usuario Borrado"
            });
          }
        });
      } else {
        callback(null, {
          "msg": "no existe el Usuario que desea borrar, o su ID no coincide"
        });
      }
    });
  }
}

module.exports = userModel;
