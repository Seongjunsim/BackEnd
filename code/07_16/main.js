// @ts-check

/* eslint-disable no-console */

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
const app = require('./app');

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`The Express server is lintening at port: ${PORT}`);
});
