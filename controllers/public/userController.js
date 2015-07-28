var config 		= require('config');
var mongoose = require('mongoose'),
User = mongoose.model('User');

var sessionHolder = require('witouch-sockets').sessionHolder;

exports.findAll = function(req, res){
  User.find(function(err, users) {
  	if (err)
        res.send(err);

    Object.keys(users).forEach(function(key) {
    	users[key].isOnline = sessionHolder.isOnline(users[key]._id);
	});

    res.render('users',{tagline:"All users",users:users,serverPath:config.get("Socket.baseUrl")});
  });
};

exports.findById = function() {};
exports.add = function() {};
exports.update = function() {};
exports.delete = function() {};