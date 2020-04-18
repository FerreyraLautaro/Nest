const mysql = require('mysql');

var connection = mysql.createConnection({multipleStatements: true});
connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'e5TBlg5FBOTbfWEP',
  database: 'api_integrador_notifications'
});

let notificationModel = {};

notificationModel.getNotifications = (callback) => {
  if (connection) {
    connection.query('SELECT * FROM notifications ORDER BY id',
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


notificationModel.insertNotifications = (dataNotif, callback) => {

/*
console.log('Notifications Insert');
console.log(connection);
console.log(dataNotif);*/


  if (connection) {
    connection.query('INSERT INTO notifications SET ?', dataNotif,
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






module.exports = notificationModel;
