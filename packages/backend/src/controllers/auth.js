const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../db');
const env = require('../env.js');
const { Router } = require('express');
//Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$%) e tamanho entre 6-20.
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/;


const route = Router();

async function login(req, res){
	const email = req.body.email || '';
	const password = req.body.password || '';
	const user = await User.findOne({ where: { email }});
	if (user && bcrypt.compareSync(password, user.password)) {
		const token = jwt.sign({userId: user.id}, env.authSecret, {
			expiresIn: '1 day'
		});
		const { name, email, avatar } = user;
		res.json({ name, email, avatar, token });
	} else {
		res.status(400).send({
			errors: ['login.userOrPasswordInvalid']
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
	const avatar = req.body.avatar;
	const password = req.body.password || '';
	const confirmPassword = req.body.confirmPassword || '';

	if (!password.match(passwordRegex)) {
		return res.status(400).send({
			errors: [
				'signup.passwordNotSafetyRules'
			]
		});
	}
	const salt = bcrypt.genSaltSync();
	const passwordHash = bcrypt.hashSync(password, salt);
	if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
		return res.status(400).send({
			errors: ['signup.passwordNotMatch']
		});
	}
	//valida se usuario ja não existe
	const user = await User.findOne({ where: { email } });
	if (user) {
		return res.status(400).send({
			errors: ['signup.userAlreadyRegistered']
		});
	}
	await User.create({
			name,
			email,
			avatar,
			password: passwordHash
	});
	await login(req, res);
});

module.exports = route;
