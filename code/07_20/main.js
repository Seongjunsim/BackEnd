// @ts-check

// Template engine : Pug
// CSS framework: TailwindCSS

/**
 * @typedef Chat
 * @property {string} message
 * @property {string} nickname
 *
 */

const Pug = require('koa-pug');
// eslint-disable-next-line import/newline-after-import
const Koa = require('koa');
const path = require('path');
const route = require('koa-route');
const websockify = require('koa-websocket');
const serve = require('koa-static');
const mount = require('koa-mount');
const mongoClient = require('./mongo');
const app = websockify(new Koa());

// @ts-ignore
const pug = new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app, // Binding `ctx.render()`, equals to pug.use(app)
});

app.use(mount('/public', serve('code/07_20/public')));

app.use(async (ctx) => {
  await ctx.render('main');
});

/* eslint=disable-next-line no-underscore-dangle */
const _client = mongoClient.connect();

async function getChatsCollection() {
  const client = await _client;
  return client.db('chat').collection('chats');
}

// Using routes
app.ws.use(
  route.all('/ws', async (ctx) => {
    const chatCollection = await getChatsCollection();
    const chatsCursor = chatCollection.find(
      {},
      {
        sort: {
          createdAt: 1,
        },
      }
    );

    const chats = await chatsCursor.toArray();
    ctx.websocket.send(
      JSON.stringify({
        type: 'sync',
        payload: {
          chats,
        },
      })
    );

    ctx.websocket.on('message', async (data) => {
      if (typeof data !== 'string') return;

      /** @type {Chat} */
      const chat = JSON.parse(data);

      await chatCollection.insertOne({
        ...chats,
        createdAt: new Date(),
      });

      const { nickname, message } = chat;

      const { server } = app.ws;
      if (!server) return;

      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'chat',
            payload: {
              message,
              nickname,
            },
          })
        );
      });
    });
  })
);

app.listen(5000);
