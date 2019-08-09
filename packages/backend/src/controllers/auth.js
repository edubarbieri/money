const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, formatDbError } = require('../db');
const env = require('../env.js');
const { Router } = require('express');

const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/;


const route = Router();

async function login(req, res){
	const email = req.body.email || '';
	const password = req.body.password || '';
	const user = await User.findOne({ where: { email }});
	if (user && bcrypt.compareSync(password, user.password)) {
		const token = jwt.sign({id: user.id}, env.authSecret, {
			expiresIn: '1 day'
		});
		const { name, email } = user;
		res.json({ name, email, token });
	} else {
		res.status(400).send({
			errors: ['Usuário/Senha inválidos']
		});
	}
}

route.post('/login', login);

route.post('/validateToken', function (req, res) {
	const token = req.body.token || '';
	jwt.verify(token, env.authSecret, function(err) {
		res.status(200).send({ valid: !err });
	});
});

route.post('/signup', async function (req, res) {
	const name = req.body.name || '';
	const email = req.body.email || '';
	const password = req.body.password || '';
	const confirmPassword = req.body.confirmPassword || '';

	if (!password.match(passwordRegex)) {
		return res.status(400).send({
			errors: [
				'Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$%) e tamanho entre 6-20.'
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
	const user = await User.findOne({ where: { email } });
	if (user) {
		return res.status(400).send({
			errors: ['Usuário já cadastrado.']
		});
	}
	await User.create({
			name,
			email,
			password: passwordHash
	});
	await login(req, res);
});

module.exports = route;
