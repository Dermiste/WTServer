exports.start = function() {
	var io 		   = require('socket.io');
	var express    = require('express');        
	var app        = express();                 

	var cookieParser = require('cookie-parser');
	var bodyParser   = require('body-parser');
	var mongoose     = require('mongoose');
	
	var passport     = require('passport');
	require(__dirname+'/config/passport')(passport);

	var session      = require('express-session');

	var flash        = require('connect-flash');

	var witouchSockets = require('witouch-sockets');

	var mongoUri = 'mongodb://localhost:27017/DevEdall'
	mongoose.connect(mongoUri);

	var db = mongoose.connection;
	db.on('error', function () {
	  throw new Error('unable to connect to database at ' + mongoUri);
	});

	var User     = require('./models/user');

	app.use(cookieParser()); // read cookies (needed for auth)
	app.use(bodyParser()); // get information from html forms

	app.set('view engine', 'ejs');
	app.set('views', __dirname+'/views')
	app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	var port = process.env.PORT || 8080;       
	
	// ROUTES FOR OUR API
	// =============================================================================

	// API
	var apiRouter = express.Router();
	require('./routes/api')(apiRouter, passport);
	app.use('/api', apiRouter);

	// PUBLIC
	var publicRouter = express.Router();
	require('./routes/public')(publicRouter, passport);
	app.use('/', publicRouter);
	
	// STATIC ROUTE 
	app.use('/static', express.static(__dirname + '/public'));

	// START THE SERVER
	// =============================================================================
	app.listen(port);
	console.log('Server started on port ' + port);

	delete exports.start;

	// THE SOCKET
	// =============================================================================
	
	
	witouchSockets.init(port + 1, app);

}
