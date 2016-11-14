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
		var pista = "";
		for (var i = 0; i < req.query.fallos; i++) {
			pista = pista + req.quiz.respuesta.charAt(i);
		}
		res.render('quizes/show',{quiz: req.quiz, errors:[], letra: pista, fallos: req.query.fallos});
	})
};


//GET /quizes/:id/answer
exports.answer = function(req, res){
	var fallos = req.query.fallos;
	var resultado = 'Incorrecto';
	if (req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()){
		resultado = 'Correcto';
	}else{
		fallos++;
	}
	res.render('quizes/answer',{ quiz: req.quiz,
		respuesta: resultado ,
		letra: req.quiz.respuesta.charAt(0),
		fallos: fallos,
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