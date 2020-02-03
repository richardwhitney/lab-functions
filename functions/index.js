const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./lab-fyp-rw-f55f36454a34");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lab-fyp-rw.firebaseio.com"
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.getTests = functions.https.onRequest((request, response) => {
  admin.firestore()
    .collection('tests')
    .get()
    .then((data) => {
      let tests = [];
      data.forEach(doc => {
        tests.push(doc.data());
      });
      return response.json(tests);
    })
    .catch((err) => console.error("Error" + err));
});

exports.createTest = functions.https.onRequest((request, response) => {
  if (response.method !== 'POST') {
    return response.status(400).json({error: 'Method not allowed'});
  }
  const newTest = {
    name: request.body.name,
    referenceRange: request.body.referenceRange,
    requestForm: request.body.requestForm,
    specialNotes: request.body.specialNotes,
    specimenTypeVolume: request.body.specimenTypeVolume,
    turnaroundTime: request.body.turnaroundTime
  };

  admin
    .firestore()
    .collection('tests')
    .add(newTest)
    .then(doc => {
      response.json({message: `Document ${doc.id} created successfully`});
    })
    .catch(err => {
      response.status(500).json({error: 'Something went wrong'});
      console.error(err);
    });
});