const request = require("supertest");
const factories = require('../factories');
const app = require("../../src/app");
const {sequelize} = require('../../src/db')

beforeAll(async() => {
    await sequelize.sync();
});
  
afterAll(() => {
    console.log('After all')
});

describe('signup', () => {
    test('deve criar novo usuario com parametros validos.', async () =>{
        const password= 'QwtOtt@#$1234'
        const signupRequest = factories.signupRequest({ password, confirmPassword: password});
        const response = await request(app).post('/signup').send(signupRequest);
        expect(response.status).toBe(200);
    })

    test('deve ser retornado token de autenticação.', async () =>{
        const password= 'QwtOtt@#$4321'
        const signupRequest = factories.signupRequest({ password, confirmPassword: password});
        const response = await request(app).post('/signup').send(signupRequest);
        expect(response.body.token).toBeDefined();
    })
    test('deve retornar erro quando senhas não coinsidirem', async () =>{
        const password= 'QwtOtt@#$1234'
        const signupRequest = factories.signupRequest({ password, confirmPassword: 'password'});
        const response = await request(app).post('/signup').send(signupRequest);
        expect(response.body.errors).toContain('signup.passwordNotMatch');
    })

    test('deve retornar erro quando senhas for fraca', async () =>{
        const password= '1234'
        const signupRequest = factories.signupRequest({ password, confirmPassword: password});
        const response = await request(app).post('/signup').send(signupRequest);
        expect(response.body.errors).toContain('signup.passwordNotSafetyRules');
    })

    test('deve retornar erro quando usuário ja estiver cadastrado', async () =>{
        const password = 'QwtOtt@#$4321';
        const signupRequest = factories.signupRequest({ password, confirmPassword: password});
        await request(app).post('/signup').send(signupRequest);
        const response = await request(app).post('/signup').send(signupRequest);
        expect(response.body.errors).toContain('signup.userAlreadyRegistered');
    })
});

describe('login', () => {
    const password = 'QwtOtt@#$4321';
    const signupRequest = factories.signupRequest({ password, confirmPassword: password});
    beforeAll(async() => {
        await request(app).post('/signup').send(signupRequest);
    })

    test('deve retornar erro se usuario e ou senha for invalido', async () =>{
        const loginRequest = {email: 'teste@teste.com', password: '1234'};
        const response = await request(app).post('/login').send(loginRequest);
        expect(response.body.errors).toContain('login.userOrPasswordInvalid');
    })

    test('deve retornar status 200 se usuario e ou senha for valido', async () =>{
        const loginRequest = {email: signupRequest.email, password: password};
        const response = await request(app).post('/login').send(loginRequest);
        expect(response.status).toBe(200);
    })
    test('deve retornar token se usuario e ou senha for valido', async () =>{
        const loginRequest = {email: signupRequest.email, password: password};
        const response = await request(app).post('/login').send(loginRequest);
        expect(response.body.token).toBeDefined();
    })
});


describe('validateToken', () => {
    const password = 'QwtOtt@#$4321';
    const signupRequest = factories.signupRequest({ password, confirmPassword: password});
    beforeAll(async() => {
        await request(app).post('/signup').send(signupRequest);
    })

    test('deve retornar erro se o token for invalido', async () =>{
        const requestBody = {token: 'mimimimi'};
        const response = await request(app).post('/validateToken').send(requestBody);
        expect(response.body.valid).toBe(false);
    })

    test('deve retornar sucesso se o token for valido', async () =>{
        const loginRequest = {email: signupRequest.email, password: password};
        const responseLogin = await request(app).post('/login').send(loginRequest);
        const response = await request(app).post('/validateToken').send({
            token: responseLogin.body.token
        });
        expect(response.body.valid).toBe(true);
    })

    
});