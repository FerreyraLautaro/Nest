const Notifications = require('../models/notifications');

module.exports = function(app){


	app.get('/notifications', (req, res) => {
	
	Notifications.getNotifications((err, data) => {
      res.status(200).json(data);
    });

	});

	app.post('/notifications', (req, res) => {
    var dataNotif = {
      notifications_id: null,
      user_id: req.body.user_id,
      module_id: req.body.module_id,
      topic: req.body.topic,
      notification_response: JSON.stringify(req.body),
      reference_source: req.body.reference_source,
      view: req.body.view,
    };


    Notifications.insertNotifications(dataNotif, (err, data) => {
      if (data && data.insertId) {
        res.status(200).json({
          success: true,
          msg: "Inserted a new Notification",
          data: data
        });
        // res.redirect('/users/' + data.insertId);
      } else {
        res.status(500).json({
          success: false,
          msg: "Error"
        });
      }
    });
  	});


	/*app.put('/notifications/:id', (req, res) => {
    const dataCompany = {
      id: req.params.id,
      name: req.body.name,
      cnn_relation_db: req.body.cnn_relation_db
    };
    Notifications.updateCompanies(dataCompany, function (err, data) {
      if (data && data.msg) {
        res.status(200).json({data});
      } else {
        res.status(500).json({
          success: false,
          msg: 'Error'
        });
      }
    });
  	});

	app.delete('/notifications/:id', (req, res) => {
    var id = req.params.id;
    Notifications.deleteCompany(id, (err, data) =>  {
      if (data && data.msg === 'deleted' || data.msg == 'not Exists') {
        res.json({
          success: 'true',
          data
        });
      } else {
        res.status(500).json({
          msg: 'Error'
        });
      }
    });
  	});*/

}
