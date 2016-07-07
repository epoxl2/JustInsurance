var LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport, models ) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
		done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        models.users.findOne(id, function(err, user) {
            done(err, user);
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
		// asynchronous
        // User.findOne wont fire unless data is sent back
		
		
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        models.users.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);
            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'Elija otro mail'));
            } else {
				// if there is no user with that email
                // create the user

                var newUser = new models.users();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
				newUser.local.nombre = req.body.nombre;
				newUser.local.apellido = req.body.apellido;
				newUser.Domicilio = { Calle : req.body.calle, Nro : req.body.nro, Localidad : req.body.Localidad,
											CPA : req.body.cpa, Piso : req.body.piso, Dto : req.body.dto
										   };		 
				// save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });    
    }));
	
	passport.use('local', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
    },
	function(req, email, password, done){
			process.nextTick(function() {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists	
        models.users.findOne({ 'local.email' :  email },function(err,user){
			if(err){
				return done(err);
			}
			if(user){
				if(user.validPassword(password)){
					return done(null,user);
				}
				else
					return done(null, false, req.flash('loginMessage', 'Verifique sus datos'));
			}
			else{
				return done(null,false,req.flash('loginMessage', 'Verifique sus datos'));
			}
		})
		});
	}));
};