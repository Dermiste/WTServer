var witouchSockets = require('witouch-sockets');
var config         = require('config');

module.exports = function(app, passport){
    var user = require(__dirname+'/../controllers/public/userController');
    var sessionHolder = require('witouch-sockets').sessionHolder;

    app.post('/requestFeed',function(req,res){
        console.log("Request feed :"+req.body.feedName+ " from client "+req.user._id);

        witouchSockets.requestFeedPublication (req.body.feedName, req.user._id, function(){
            console.log("yaaaaay published");
            res.json({message:"Feed requested"});
        });
    });

    app.get('/', function(req, res) {
        res.render('index.ejs',{tagline:"Home"}); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage'),tagline:"Login" }); 
    });

    // process the login form
	app.post('/login', passport.authenticate('local-login', {
        successRedirect : './profile', // redirect to the secure profile section
        failureRedirect : './login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage'),tagline:"Signup" });
    });

    // process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : './profile', // redirect to the secure profile section
        failureRedirect : './signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        req.user.isOnline = sessionHolder.isOnline(req.user._id);
        res.render('profile.ejs', {
        	tagline : "Profile",
            user : req.user, // get the user out of session and pass to template
            serverPath : config.get("Socket.baseUrl")
        });
    });


// =====================================
    // USERS SECTION =====================
    // =====================================
    app.get('/users', isLoggedIn, user.findAll);  

    app.get('/cams', isLoggedIn, function(req,res){
        //console.log("/cams");
        //console.log(req.user.camFeeds[0]);
        res.render('cams.ejs', {
            clientID : req.user._id,
            tagline : "My cams",
            camFeeds : req.user.camFeeds, // get the user out of session and pass to template,
            serverPath : config.get("Socket.baseUrl")
        });
    });    

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('./');
    });
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('./');
}