'use strict';
const swaggerRoutes = require('swagger-routes');
const express = require('express');
const app = express();
app.enable('trust proxy');

var bodyParser = require('body-parser');
var cors = require('cors');
app.use(cors());  // enable pre-flight
app.use(bodyParser.json());

const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
var docRef = db.collection('users').doc('alovelace');

var setAda = docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
});


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


const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});