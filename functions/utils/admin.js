const admin = require('firebase-admin');
const serviceAccount = require("../lab-fyp-rw-f55f36454a34");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lab-fyp-rw.firebaseio.com"
});

const db = admin.firestore();

module.exports = {admin, db};