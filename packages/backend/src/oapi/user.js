const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, formatDbError } = require('../sequelize');
const env = require('../env.js');

const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/;

const login = (req, res) => {
	console.log('teste');
	const email = req.body.email || '';
	const password = req.body.password || '';
	User.findOne({
		where: { email }
	}).then(user => {
		if (user && bcrypt.compareSync(password, user.password)) {
			const token = jwt.sign(user.toJSON(), env.authSecret, {
				expiresIn: '1 day'
			});
			const { name, email } = user;
			res.json({
				name,
				email,
				token
			});
		} else {
			return res.status(400).send({
				errors: ['Usuário/Senha inválidos']
			});
		}
	});
};

const validateToken = (req, res) => {
	const token = req.body.token || '';
	jwt.verify(token, env.authSecret, function(err) {
		return res.status(200).send({
			valid: !err
		});
	});
};

const signup = (req, res) => {
	const name = req.body.name || '';
	const email = req.body.email || '';
	const password = req.body.password || '';
	const confirmPassword = req.body.confirmPassword || '';

	if (!password.match(passwordRegex)) {
		return res.status(400).send({
			errors: [
				'Senha precisar ter: uma letra maiúscula, uma letra minúscula, um n úmero, uma caractere especial(@#$%) e tamanho entre 6-20.'
			]
		});
	}
	const salt = bcrypt.genSaltSync();
	const passwordHash = bcrypt.hashSync(password, salt);
	if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
		return res.status(400).send({
			errors: ['Senhas não conferem.']
		});
	}

	//valida se usuario ja não existe
	User.findOne({
		where: { email }
	}).then(user => {
		if (user) {
			return res.status(400).send({
				errors: ['Usuário já cadastrado.']
			});
		}
		User.create({
			name,
			email,
			password: passwordHash
		})
			.then(() => {
				login(req, res);
			})
			.catch(e => formatDbError(res, e));
	});
};

module.exports = { login, signup, validateToken };

module.exports = router => {
	router.post('/login', login);
	router.post('/signup', signup);
	router.post('/validateToken', validateToken);
};
