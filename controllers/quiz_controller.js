// GET /quizes/question
exports.question = function(req, res) {
	res.render('quizes/question', {
		pregunta: 'Capital de Italia'
	});
};

//GET /quizes/answer
exports.answer = function(req, res) {
	var respuestas = req.query.respuesta.toUpperCase();
	if (respuestas === 'ROMA') {
		res.render('quizes/answer', {
			respuesta: 'Correcto'
		});
	} else {
		res.render('quizes/answer', {
			respuesta: 'Incorrecto'
		});
	}
};