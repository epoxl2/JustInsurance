module.exports = function(mongoose){
    /*Connect to mongoosedb*/

    mongoose.connect('mongodb://localhost/justinsurance');

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
      console.log('Conectado a Db correctamente');
    });

    /*Models*/

    var userSchema  = require('./userSchema');
    var personaSchema = require('./personaSchema');
    
    var userSchemaobj = new userSchema(mongoose);
    var personaSchemaobj = new personaSchema(mongoose);

    var models = {
    	users : userSchemaobj.getSchema(),
        personas : personaSchemaobj.getSchema()
    };

    return models;
}