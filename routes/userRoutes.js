const UserModel = require('../models/users');
var service = require('../models/service');

var uuid = '1234';

module.exports = app => {

  app.get('/users', (req, res) => {
    UserModel.getUsers((err, data) => {
      res.status(200).json(data);
    });
  });


  app.post('/userlogin', (req, res) => {
    var userLogin = {
      email: req.body.email,
      passwrd: req.body.passwrd
    };
    console.log(userLogin);
    UserModel.loginUser(userLogin, (err, data) => {
      if (data && data.length == 1) {
        res.status(200).json({
          success: true,
          msg: "ingreso",
          token: service.createToken(uuid),
          data: data[0]
        });
        // res.redirect('/users/' + data.insertId);
      }else if(data.length < 1){
        res.status(404).json({
          success: false,
          msg: "Login Incorrecto"
        });

      } else {
        res.status(500).json({
          success: false,
          msg: "Error 500"
        });
      }
    });
  });


  app.post('/users', (req, res) => {
    var userData = {
      id: null,
      company_id: req.body.company_id,
      email: req.body.email,
      passwrd: req.body.passwrd,
      role_id: req.body.role_id
    };
    UserModel.insertUser(userData, (err, data) => {
      if (data && data.insertId) {
        res.status(200).json({
          success: true,
          msg: "Nuevo usuario insertado",
          data: data
        });
        // res.redirect('/users/' + data.insertId);
      } else {
        res.status(500).json({
          success: false,
          msg: "Error 500"
        });
      }
    });
  });

  
  app.put('/users/:id', (req, res) => {
    const userData = {
      id: req.params.id,
      company_id: req.body.company_id,
      email: req.body.email,
      passwrd: req.body.passwrd,
      role_id: req.body.role_id
    };
    UserModel.updateUser(userData, function (err, data) {
      if (data && data.msg) {
        res.status(200).json({data});
      } else {
        res.status(500).json({
          success: false,
          msg: 'Error 500'
        });
      }
    });
  });

  
  app.delete('/users/:id', (req, res) => {
    var id = req.params.id;
    UserModel.deleteUser(id, (err, data) =>  {
      if (data && data.msg === 'Usuario Borrado' || data.msg == 'No existe el usuario que desea borrar') {
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
  });



};
