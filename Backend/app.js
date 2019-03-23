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

// // By default, the client will authenticate using the service account file
// // specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// // the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// // https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// // These environment variables are set automatically on Google App Engine
// const Datastore = require('@google-cloud/datastore');
//
// // Instantiate a datastore client
// const datastore = Datastore();


const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});