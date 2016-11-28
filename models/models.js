var path = require('path');

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
var sequelize = new Sequelize(null, null, null, {
	dialect: "sqlite",
	storage: "quiz.sqlite"
});



// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definicion de la tabla User
var quiz_path = path.join(__dirname,'users');
var Users = sequelize.import(quiz_path);

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	//sucess(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count) {
		if (count === 0) { // la tabla se inicializa sólo si está vacía
			Quiz.create({
					pregunta: 'Capital de Italia',
					respuesta: 'Roma'
				});
			Quiz.create({
					pregunta: 'Capital de Portugal',
					respuesta: 'Lisboa'
				})
				.then(function() {
					console.log('Base de datos inicializada')
				});
		};
	});

	Users.count().then(function(count) {
		if (count === 0) { // la tabla se inicializa sólo si está vacía
			Users.create({
					username: 'admin',
					password: '1234'
				});
			Users.create({
					username: 'pepe',
					password: '5678'
				})
				.then(function() {
					console.log('Base de datos inicializada')
				});
		};
	});
});

exports.Quiz = Quiz; // exportar tabla Quiz
exports.Comment = Comment;
exports.Users = Users;