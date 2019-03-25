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
const datastore = new Datastore();

gstore.connect(datastore);


var bodyParser = require('body-parser');
var cors = require('cors');
app.options('*', cors());  // enable pre-flight
app.use(bodyParser.json());


const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});