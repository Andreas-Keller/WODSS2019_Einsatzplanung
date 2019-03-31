'use strict';
const swaggerRoutes = require('swagger-routes');
const express = require('express');
const app = express();
app.enable('trust proxy');

var bodyParser = require('body-parser');
var cors = require('cors');
app.use(cors());  // enable pre-flight
app.use(bodyParser.json());

// const { Gstore } = require('gstore-node');
// const { Datastore } = require('@google-cloud/datastore');
//
// const gstore = new Gstore();
// const datastore = new Datastore();

swaggerRoutes(app, {
    api: './api.yml',
    handlers:  './handlers',
    authorizers: './handlers/security'
});


// gstore.connect(datastore);

/*
    mongoose connection
 */
const mongoose = require('mongoose')
const url = `mongodb://127.0.0.1/wodds-testing`
mongoose.Promise = global.Promise
mongoose.connect(url, { useNewUrlParser: true });


const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
