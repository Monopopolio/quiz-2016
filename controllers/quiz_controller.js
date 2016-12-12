var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.findById(quizId).then(
		function(quiz){
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId));}
		}).catch(function(error) {next(error);});
};

//GET /quizes/:id
exports.show = function (req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		res.render('quizes/show',{quiz: req.quiz, errors:[]});
	})
};


//GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = '';
	var acierto = 0;
	if(req.session.user){
		acierto = req.session.user.aciertos;
	}else if(isNaN(req.session.aciertos)){
		acierto = 0;
	}else{
		acierto = req.session.aciertos;
	}
	
	if(req.query.respuesta){
		resultado = 'Incorrecto';
		if (req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()){
			resultado = 'Correcto';
			acierto = acierto + 1;
			if(req.session.user){
				req.session.user.aciertos = acierto;
			}else{
				req.session.aciertos = acierto;
			}
		}
	}
	res.render('quizes/answer',{ quiz: req.quiz,
		respuesta: resultado,
		aciertos: acierto,
		errors: []
	}
	);
};

//GET /quizes
exports.index= function(req, res){
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index', {quizes: quizes, errors: []});
	})
};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build( // crea objeto quiz
		{pregunta:"", respuesta: ""}
		);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	quiz.validate().then(function(err){
		if(err){
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else{
			quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
		res.redirect('/quizes');
		}) //redireccion HTTP (URL relativo) lista de preguntas

		}
	}
	);
};

//GET /quizes/:id/edit
exports.edit = function(req, res){
	var Quiz = req.quiz; // autoload de instancia de quiz
	res.render('quizes/edit', {quiz: Quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz.validate().then(function(err){
		if (err) {
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else {
			req.quiz //save: guarda campos pregunta y respuesta en DB
			.save({fields: ["pregunta", "respuesta"]})
			.then( function(){ res.redirect('/quizes');});
		}		// Redireccion HTTP a lista de preguntas (URL relativo)
	}
	);
};

// DELETE /quizes/ :id
exports.destroy = function(req, res){
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

// Autoload :id
exports.load = function(req, res, next, quizId){
	models.Quiz.findOne({
		where: { id: Number(quizId) },
		include: [{ model: models.Comment }]
	}).then(function(quiz){
		if (quiz) {
			req.quiz = quiz;
			next();
		} else{next(new Error('No existe quizId=' + quizId))}
	}
	).catch(function(error){next(error)});
};