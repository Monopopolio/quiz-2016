var models = require('../models/models.js');
//GET /quizes/question
exports.question = function (req, res) {
	models.Quiz.findAll().then(function(quiz){
		res.render('quizes/question',{pregunta: quiz[0].pregunta });
	})
};

//GET /quizes/answer
exports.answer = function(req, res){
	models.Quiz.findAll().then(function(quiz){
		if (req.query.respuesta.toUpperCase() === quiz[0].respuesta.toUpperCase() && quiz[0].fallos < 5){
			quiz[0].aciertos++;
			quiz[0].save();
			res.render('quizes/answer', {respuesta: 'Correcta', aciertos: quiz[0].aciertos, fallos: quiz[0].fallos});
		} else if (req.query.respuesta != quiz[0].respuesta && quiz[0].fallos <= 4) {
			quiz[0].fallos++;
			quiz[0].save();
			res.render('quizes/answer', {respuesta: 'Incorrecta', aciertos: quiz[0].aciertos, fallos: quiz[0].fallos});
		}	

		if (quiz[0].fallos == 5){
			res.render('quizes/answer', {respuesta: 'UPS. Ha fallado 5 veces', aciertos: quiz[0].aciertos, fallos: quiz[0].fallos});
			quiz[0].aciertos = 0;
			quiz[0].fallos = 0;
			quiz[0].save();
		}	
		
	})
};

// && req.query.intentos === quiz[0].intentos