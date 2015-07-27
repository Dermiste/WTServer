var mongoose = require('mongoose'),
CamFeed = mongoose.model('CamFeed');

exports.findAll = function(req, res){
  CamFeed.find({},function(err, results) {
    return res.send(results);
  });
};
exports.findById = function() {};
exports.add = function() {};
exports.update = function() {};
exports.delete = function() {};