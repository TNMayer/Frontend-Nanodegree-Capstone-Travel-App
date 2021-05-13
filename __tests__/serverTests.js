require("regenerator-runtime/runtime");

const {app} = require('../src/server/server.js');
const supertest = require('supertest');
const request = supertest(app);


describe('Test for endpoint /testendpoint', () => {
  it('should return a status 200', async (done) => {
    const response = await request.get('/testendpoint');
    expect(response.status).toBe(200);
    done();
  });
});