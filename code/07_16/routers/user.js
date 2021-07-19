const express = require('express');

const USERS = {
  15: {
    nickname: 'foo',
  },
};

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.send('Root - get');
});

userRouter.param('id', async (req, res, next, value) => {
  const user = USERS[value];
  try {
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    // @ts-ignore
    req.user = USERS[value];
    next();
  } catch (err) {
    next();
  }
});

// /users/15
userRouter.get('/:id', (req, res) => {
  const resMineType = req.accepts(['json', 'html']);

  if (resMineType === 'json') {
    // @ts-ignore
    res.send(req.user);
  } else if (resMineType === 'html') {
    res.render('user-profile', {
      nickname: req.user.nickname,
    });
  }
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

module.exports = userRouter;
