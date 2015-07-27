module.exports = function(app, passport){
    var user            = require(__dirname+'/../controllers/api/userController');
    var User            = require('../models/user');


    app.post('/login', function(req,res){
        User.findOne({ 'email' :  req.body.email }, function(err, user) {
            if (!user)
                res.json({"message":"Unknow user", "success":false,"user":{}});

            if (!user.validPassword(req.body.password))
                res.json({"message":"Wrong password", "success":false,"user":{}});

            res.json({"message":"User found password", "success":true,"user":user});
        });
    });

    app.post('/signup', function(req,res){
        User.findOne({ 'email' :  req.body.email }, function(err, user) {
            // if there are any errors, return the error
            //if (err)
                //creturn done(err);

            // check to see if theres already a user with that email
            if (user) {
                res.json({"message":"That email is already taken", "success":false,"user":{}});
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.name     = req.body.name;
                newUser.email    = req.body.email;
                newUser.password = newUser.generateHash(req.body.password);

                // save the user
                newUser.save(function(err) {
                    //if (err)
                        //throw err;
                    res.json({"message":"User created", "success":true,"user":newUser});
                });
            }

        });  
    });    

    app.post('/registerCam', function(req,res){
        User.findOne({ 'email' :  req.body.email }, function(err, user) {
            if (!user)
                res.json({"message":"Unknow user", "success":false,"user":{}});


            var cam = {};
            cam.name = req.body.name;
            cam.rtmpUri = req.body.rtmpUri;

            user.camFeeds.push(cam);
            user.save(function(err){
                if (err)
                    res.json({"message":"Error saving cam on main server", "success":false});
                else
                    res.json({"message":"Cam saved on main server", "success":true});

            })
        });
    });

    app.post('/removeCam', function(req,res){
        console.log("//// REMOVE CAM ///");
        User.findOne({ 'email' :  req.body.email }, function(err, user) {
            if (!user)
                res.json({"message":"Unknow user", "success":false,"user":{}});


            console.log("found user");
            console.log(user);

            var cam = {};
            cam.name = req.body.name;
            cam.rtmpUri = req.body.rtmpUri;

            console.log(req.body);

            console.log("List of feed before");
            console.log(user.camFeeds);

            var delta = user.camFeeds.length;

            result = user.camFeeds.filter(function(o){
                if (cam.name == o.name && cam.rtmpUri == o.rtmpUri) return false;
                else return true;
            });

            delta -= result.length;

            console.log("removed feed is ");
            console.log(result);

            user.camFeeds = result;

            console.log("List of feed after");
            console.log(user.camFeeds);

            user.save(function(err){
                if (err)
                    res.json({"message":"Error deleting cam on main server", "success":false});
                else
                    if (delta > 0)
                        res.json({"message":"Cam deleted on main server", "success":true});
                    else 
                        res.json({"message":"Error deleting cam on main server, cam not found", "success":false});

            })
        });
    });


    app.get('/users',isLoggedIn, user.findAll);

    app.get('/profile', function(req, res) {
        //req.user.isOnline = sessionHolder.isOnline(req.user._id);
        console.log("Displaying logged in user:");
        console.log(req.user);
        res.json(req.user);
    });
};

function isLoggedIn(req, res, next) {
    console.log("is logged in "+req.isAuthenticated());
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('./');
}