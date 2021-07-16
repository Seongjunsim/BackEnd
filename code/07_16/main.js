// @ts-check

/* eslint-disable no-console */

const express = require('express');
const { nextTick } = require('process');

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
const bodyParser = require('body-parser');

const USERS = {
  15: {
    nickname: 'foo',
  },
};

app.use(express.json());

const userRouter = express.Router();
userRouter.get('/', (req, res) => {
  res.send('Root - get');
});

userRouter.param('id', (req, res, next, value) => {
  console.log(`id parameter`, value);
  // @ts-ignore
  req.user = USERS[value];
  next();
});

userRouter.get('/:id', (req, res) => {
  // @ts-ignore
  res.send(req.user);
});

userRouter.post('/', (req, res) => {
  res.send('User registered');
});

userRouter.post('/:id/nickname', (req, res) => {
  // @ts-ignore
  const { user } = req;
  const { nickname } = req.body;

  user.nickname = nickname;
  res.send(`User nickname ${nickname}`);
});

app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(`The Express server is lintening at port: ${PORT}`);
});
