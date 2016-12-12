 // MW de autorizacion de accesos HTTP restringidos
 exports.loginRequired = function(req, res, next){
 	if(req.session.user){
 		next();
 	} else{
 		res.redirect('/login');
 	}
 };

  // MW de autorizacion de accesos ADMIN HTTP restringidos
 exports.adminRequired = function(req, res, next){
 	if(req.session.user && req.session.user.username == "admin"){
 		next();
 	} else{
 		res.redirect('/quizes');
 	}
 };

  // MW de autorizacion de accesos Usuarios HTTP restringidos
 exports.userRequired = function(req, res, next){
 	if(req.session.user && req.session.user.username == req.user.username || req.session.user && req.session.user.username == "admin"){
 		next();
 	} else{
 		res.redirect('/quizes');
 	}
 };

// Get /login --- Formulario de login
exports.new = function (req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

// POST /login --- Crear la sesion
exports.create = function(req, res){
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user){
		if (error) { // si hay error retornamos mensajes de error de sesion
		req.session.errors = [{"message": 'Se ha producido un error: '+error}];
		res.redirect("/login");
		return;
	}

	//Crear req.session.user y guardar campos id y username
	// La sesion se define por la existencia de: req.session.user
	var acierto = 0;

	if(req.session.aciertos){
		acierto = req.session.aciertos;
		req.session.aciertos = 0;
	}else{
		acierto = 0;
	}

	req.session.user = {id:user.id, username:user.username, aciertos: acierto};
	res.redirect(req.session.redir.toString()); //Redirecion a path anterior a login
	});
};

// DELETE /logout  ---Destruir sesion
exports.destroy = function(req, res){
	delete req.session.user;
	res.redirect(req.session.redir.toString()); // redirect a path anterior a login
};