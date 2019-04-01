const admin = require("firebase-admin");

/*
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://wodss2019.firebaseio.com"
});
*/


var serviceAccount = require("/Users/andreas/Desktop/wodss2019-xyz-firebase-adminsdk-9ukeg-290c673a0a.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wodss2019-xyz.firebaseio.com",
});


const db = admin.firestore();

module.exports = {
    db
};

