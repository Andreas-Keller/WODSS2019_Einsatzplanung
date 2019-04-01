const admin = require("firebase-admin");
/*
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://wodss2019.firebaseio.com"
});
*/

//local testing of firebase db
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wodss2019.firebaseio.com"
});


const db = admin.firestore();

module.exports = {
    db
};

