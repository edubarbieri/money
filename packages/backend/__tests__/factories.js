const faker = require('faker');
const {factory}  = require("factory-girl");
const {User} = require('../src/db');

faker.locale = 'pt_BR';

factory.define("User", {}, {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password()
});

function signupRequest(ext = {}){
    const password = faker.internet.password();
    const body = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: password,
        confirmPassword: password,
        avatar: faker.internet.avatar()
    };
    return Object.assign(body, ext)
    
}

module.exports = {factory, signupRequest};