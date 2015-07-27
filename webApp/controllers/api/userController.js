var mongoose = require('mongoose'),
User = mongoose.model('User');

exports.findAll = function(req, res){
  User.find(function(err, users) {
  	if (err)
        res.send(err);

    res.json(users);    
  });
};

exports.findById = function() {};
exports.add = function() {};
exports.update = function() {};
exports.delete = function() {};