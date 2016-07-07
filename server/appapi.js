module.exports = function(express,ejs,flash,passport,models){

/*Create a Server with restify*/

var pass = require('../server/config/passport')(passport,models);

var LocalStrategy   = require('passport-local').Strategy;

var serverapi = express();

serverapi.configure(function () {
    serverapi.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    serverapi.use(express.bodyParser());
	// required for passport
	serverapi.use(express.cookieParser());
	serverapi.use(express.session({ secret: 'justinsurejustwork' })); // session secret
	serverapi.use(passport.initialize());
	serverapi.use(passport.session()); // persistent login sessions
	serverapi.use(flash());
});

serverapi.listen(81);


/*Api route*/

function IsAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/');
    }
}

function cpersona(req, res, next){
		var objpersona = new models.personas({nombre : req.body.nombre, apellido: req.body.apellido});
		objpersona.save(function(err,success){
	       		 if(success){
	           		 res.send(201 , objpersona.id);
	    		  }else{
			         res.send(err);
	        	 }
		});
}

function getpersonas(req,res){
	models.personas.find({}, function (error, persona) {
		res.send(200, persona);
	});
}

serverapi.get('/api/entity/getpersonas', IsAuthenticated, getpersonas);
serverapi.post('/api/entity/cpersona',IsAuthenticated,cpersona);
}