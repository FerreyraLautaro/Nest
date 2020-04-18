var jwt = require('jwt-simple');  
var moment = require('moment');  
//var config = require('../../../config/config').cfg;

var payload = { foo: 'bar' };
var secret = 'xxx';

exports.createToken = function(uuid) {  
    
  var payload = {
    sub: uuid,
    iat: moment().unix(),
    exp: moment().add(14, "days").unix(),
  };

  return jwt.encode(payload, secret);
};