 var bearController = require('./controllers/bearController');

 exports.isUserRegistered = function (userName, callback){
 	//console.log("Test");
 	bearController.isUserRegistered(userName,function(result){
 		callback(result);
 	});
 }