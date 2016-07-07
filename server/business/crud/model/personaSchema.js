module.exports= function(mongoose){

	var custom = [validator, 'Indique un {PATH}']

	function validator (val) {
  		return val ='' || val;
	}

	var personaSchema = mongoose.Schema({
		nombre: {type:String, validate : custom},
		apellido: String
	});

	this.getSchema = function(){
		return mongoose.model('personas', personaSchema);
	};

}