const mysql = require('mysql');

var connection = mysql.createConnection({multipleStatements: true});
connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'e5TBlg5FBOTbfWEP',
  database: 'api_auth'
});

let parameterModel = {};

parameterModel.get = (callback) => {
  if (connection) {
    connection.query('SELECT * FROM parameter ORDER BY id',
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

parameterModel.getparamsID = (id, callback) => {
    
  if (connection) {
    connection.query('SELECT * FROM parameter where service_id='+id+' ORDER BY id',
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


parameterModel.getparamsIdName = (idd, callback) => {
    
    var id = idd.id;
    var name = idd.name;

  if (connection) {
    connection.query('SELECT * FROM parameter where service_id='+id+' AND name = "'+name+'" ORDER BY id',
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




parameterModel.insert = (dataParameter, callback) => {
  if (connection) {
    //var sql = 'call MTO_INSERTORUPDATEPARAMETER(?, ?, ?)', [dataParameter.service_id, dataParameter.name, dataParameter.value]
    connection.query('CALL MTO_INSERTORUPDATEPARAMETER(?, ?, ?, ?,@_SALIDA)', [dataParameter.id, dataParameter.service_id, dataParameter.name, dataParameter.value],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          //console.log("success");
          //console.log(result);
          callback(null, result)
        }
      }
    )
  }
};




parameterModel.updateParameter = (dataParameter, callback) => {
  if (connection) {
    const sql = `
      UPDATE parameter SET
      service_id = ${connection.escape(dataParameter.service_id)},
      name = ${connection.escape(dataParameter.name)},
      value = ${connection.escape(dataParameter.value)}
      WHERE id = ${dataParameter.id}`;

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


parameterModel.deleteParameter = (id, callback) => {
  if (connection) {
    var sqlExists = `
      SELECT * FROM parameter WHERE id = ${connection.escape(id)}
    `;
    connection.query(sqlExists, (err, row) => {
      if (row) {
        var sql = `DELETE FROM parameter WHERE id=` + connection.escape(id);
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



module.exports = parameterModel;