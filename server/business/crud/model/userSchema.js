module.exports = function(mongoose){
    var bcrypt   = require('bcrypt-nodejs');
    var seg = require('../../utils/segmentacion');
    
    var userSchema = mongoose.Schema({

        local            : {
            email        : String,
            password     : String,
    		nombre		 : String,
    		apellido 	 : String
        },
    	Domicilio    : { Calle : String, Nro : String, Localidad : String, CPA : String, Piso: String , Dto : String},
    	Segmentacion : {CodSegmentacion1 : String, CodSegmentacion2: String, CodSegmentacion3 : String,
    					CodSegmentacion4 : String, CodSegmentacion5 : String, CodSegmentacion6 : String,
    					CodSegmentacion7 : String, CodSegmentacion8 : String, Nivel : String},
        facebook         : {
            id           : String,
            token        : String,
            email        : String,
            name         : String
        },
        twitter          : {
            id           : String,
            token        : String,
            displayName  : String,
            username     : String
        },
        google           : {
            id           : String,
            token        : String,
            email        : String,
            name         : String
        }

    });

    // methods ======================
    // generating a hash
    userSchema.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    // checking if password is valid
    userSchema.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.local.password);
    };

    userSchema.methods.generateSegmentacion = function(model,mailUsuarioPadre,usuarioHijo, otrocallback){
    	var segutil = new seg(model, mailUsuarioPadre);
    	segutil.buscapadre(function(usuarioPadre){
    		otrocallback(segutil.armasegmentacion(usuarioPadre,usuarioHijo));
    	});
    }


    this.getSchema = function(){
        return mongoose.model('users', userSchema);
    };
}