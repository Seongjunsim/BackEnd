// @ts-check

/* eslint-disable no-console */

const express = require('express');

const app = express();

const PORT = 5000;

// app.use('/', (req, res, next) => {
//   const requestAt = new Date();
//   console.log('Middleware 1');
//   // @ts-ignore
//   req.reqestedAt = requestAt;
//   next();
// });

// app.use((req, res) => {
//   console.log('Middleware 2');
//   // @ts-ignore
//   res.send(`hello express; ${req.reqestedAt}`);
// });

app.use(express.json());
app.use(express.static('code/07_16/public'));
app.set('views', 'code/07_16/views');
app.set('view engine', 'pug');

const userRouter = require('./routers/user');

app.use('/users', userRouter);

app.get('/', (req, res) => {
  res.render('index', {
    message: 'hello pug!',
  });
});

app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 200;
  res.send(err.message);
});

module.exports = app;
