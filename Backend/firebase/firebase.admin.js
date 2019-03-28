const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://wodss2019.firebaseio.com"
});

const db = admin.database();


module.exports = {
    db
};

