const mysql = require('mysql');

connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'e5TBlg5FBOTbfWEP',
  database: 'api_auth'
});

let companyModel = {};

companyModel.getCompanies = (callback) => {
  if (connection) {
    connection.query('SELECT * FROM company ORDER BY id',
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

companyModel.insertCompanies = (rolCompany, callback) => {
  if (connection) {
    connection.query('INSERT INTO company SET ?', rolCompany,
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

companyModel.updateCompanies = (rolCompany, callback) => {
  if (connection) {
    const sql = `
      UPDATE company SET
      name = ${connection.escape(rolCompany.name)},
      cnn_relation_db = ${connection.escape(rolCompany.cnn_relation_db)}
      WHERE id = ${rolCompany.id}`;

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


companyModel.deleteCompany = (id, callback) => {
  if (connection) {
    var sqlExists = `
      SELECT * FROM company WHERE id = ${connection.escape(id)}
    `;
    connection.query(sqlExists, (err, row) => {
      if (row) {
        var sql = `DELETE FROM company WHERE id=` + connection.escape(id);
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



module.exports = companyModel;