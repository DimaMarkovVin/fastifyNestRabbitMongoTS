import { getCollection } from './db.js';
import { getNewUser } from './helper.js';

const USERS_LIMIT = 1000000;
const CHUNK_LIMIT = 1000;

const fillDb = async () => {
  const collection = await getCollection('users');

  for (let i = 0; i < USERS_LIMIT / CHUNK_LIMIT; i++) {
    const usersChunkToCreate = [];

    for (let j = 0; j < CHUNK_LIMIT; j++) {
      usersChunkToCreate.push(getNewUser());
    }

    await collection.insertMany(usersChunkToCreate, { ordered: false });
  }
};

fillDb()
  .then(() => {
    console.log('OK');
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
