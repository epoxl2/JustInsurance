module.exports = function (express,ejs,flash,passport,models){
	
var publicserver = express();
var _baseviewdir = '../client/views/';

publicserver.configure(function(){
	publicserver.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    publicserver.use(express.bodyParser());
	publicserver.set('view engine', 'ejs');
	// required for passport
	publicserver.use(express.cookieParser());
	publicserver.use(express.session({ secret: 'justinsurejustwork' })); // session secret
	publicserver.use(passport.initialize());
	publicserver.use(passport.session()); // persistent login sessions
	publicserver.use(flash());
	publicserver.use(express.static(__dirname + '../client/public'));
});

publicserver.listen(80);

function IsAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/');
    }
}

function viewpersona(req,res,next){
		var html = new EJS({url : 'personasconsulta.ejs'}).render({vista : 'personasconsulta', user : req.user});
		res.send(201,html);//res.render('personasconsulta.ejs');
 }


function viewlogin(req,res,next){
		res.render(_baseviewdir + 'login.ejs', { message: req.flash('loginMessage') });
};
function viewsingup(req,res,next){
		res.render(_baseviewdir + 'signup.ejs',{ message: req.flash('signupMessage') });
};
function viewindex(req,res,next){
		res.render(_baseviewdir + 'index.ejs');
};
function viewhome(req,res,next){
		res.render(_baseviewdir + 'home.ejs', {user : req.user});
}

function viewprofile(req,res,next){
		res.render(_baseviewdir + 'profile.ejs', {user : req.user});
}

function postprofile(req,res,next){
		var segmentaciongenerada;
		req.user.generateSegmentacion(models,req.body.emailPadre, req.user, function(octeto){
			console.log(octeto);
			segmentaciongenerada = octeto;
		});

		models.users.findOne({ 'local.email': req.user.local.email }, function (err, user) {
			  if (err)
				console.log('error actualizando la segmentacion');
			  user.Segmentacion = segmentaciongenerada;
			  user.save(function(){res.render(_baseviewdir + 'profile.ejs', {user:req.user})});
		});
}

publicserver.get('/views/personas',IsAuthenticated, viewpersona);


publicserver.get('/',viewindex);
publicserver.get('/login',viewlogin);
publicserver.get('/profile',IsAuthenticated,viewprofile);
publicserver.post('/profile',IsAuthenticated,postprofile);
publicserver.post('/login', passport.authenticate('local', {
		successRedirect : '/home',
		failureRedirect : '/login',
		failureFlash : true
	}));
publicserver.get('/home',IsAuthenticated,viewhome);

publicserver.get('/signup', viewsingup);
publicserver.post('/signup', 	passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	})
);
//server.get('/home',{});
publicserver.get('/logout', viewlogin);


}