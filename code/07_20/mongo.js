// @ts-check

const { MongoClient } = require('mongodb');

const uri =
  'mongodb+srv://Seongjun:sj8672031!@cluster0.5o7em.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = client;
