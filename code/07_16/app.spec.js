/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */

const supertext = require('supertest');
const app = require('./app');

const request = supertext(app);

test('our first test', async () => {
  const result = await request.get('/users/15').accept('application/json');
  console.log(result);

  expect(result.body).toMatchObject({
    ninkname: expect.any(String),
  });
});
