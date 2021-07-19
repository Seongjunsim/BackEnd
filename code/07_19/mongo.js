// @ts-check

const { MongoClient } = require('mongodb');

const uri =
  'mongodb+srv://Seongjun:sj8672031!@cluster0.5o7em.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function main() {
  await client.connect();

  const users = client.db('fc21').collection('users');
  const cities = client.db('fc21').collection('cities');

  users.deleteMany({}); //유저 컬렉션 비우기
  cities.deleteMany({});
  await cities.insertMany([
    {
      name: 'Seoul',
      population: 300,
    },
    {
      name: 'Busan',
      population: 3231,
    },
    {
      name: 'Hanam',
      population: 5523,
    },
  ]);
  await users.insertMany([
    //one to many : 임배딩이 필요
    {
      name: 'foo',
      birthYear: 2000,
      contact: [
        {
          phoneNumber: '01020397096',
          type: 'phone',
        },
      ],
      city: 'Seoul',
    },
    {
      name: 'Bar',
      birthYear: 2009,
      city: 'Busan',
    },
    {
      name: 'Baz',
      birthYear: 2005,
      city: 'Hanam',
    },
  ]);

  //   await users.deleteOne({
  //     name: 'Baz',
  //   });

  //   users.updateOne(
  //     {
  //       name: 'Baz',
  //     },
  //     {
  //       $set: {
  //         name: 'Boo',
  //       },
  //     }
  //   );
  //   const cursor = users.find(
  //     {
  //       birthYear: {
  //         $gte: 2001,
  //       },
  //     },
  //     {
  //       sort: {
  //         birthYear: 1,
  //       },
  //     }
  //   );

  const cursor = users.aggregate([
    {
      $lookup: {
        from: 'cities',
        localField: 'city',
        foreignField: 'name',
        as: 'city_info',
      },
    },
    {
      $match: {
        'city_info.population': {
          $gte: 3000,
        },
      },
    },
  ]);
  await cursor.forEach(console.log);
  await client.close;
}

main();
