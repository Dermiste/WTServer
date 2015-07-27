var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CamFeedSchema   = new Schema({
    name: String,
    uri :String
});

module.exports = mongoose.model('CamFeed', CamFeedSchema);