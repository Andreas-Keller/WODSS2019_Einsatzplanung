'use strict';
const swaggerRoutes = require('swagger-routes');
const express = require('express');
const app = express();
app.enable('trust proxy');

swaggerRoutes(app, {
    api: './api.yml',
    handlers:  './handlers',
    authorizers: './handlers/security'
});

const { Gstore } = require('gstore-node');
const { Datastore } = require('@google-cloud/datastore');

const gstore = new Gstore();
const datastore = Datastore();

gstore.connect(datastore);
const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});