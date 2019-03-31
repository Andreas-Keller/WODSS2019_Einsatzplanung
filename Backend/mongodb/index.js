const path = require('path');
const { Seeder } = require('mongo-seeding');

const config = {
    database: {
        host: '127.0.0.1',
        port: 27017,
        name: 'wodds-testing',
    },
    dropDatabase: true,
};
process.env.DEBUG = 'mongo-seeding';
const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(
    path.resolve('./seeddata'),
    {
        transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
    },
);

seeder
    .import(collections)
    .then(() => {
        console.log('Success');
    })
    .catch(err => {
        console.log('Error', err);
    });
