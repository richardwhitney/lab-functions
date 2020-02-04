const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./lab-fyp-rw-f55f36454a34");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lab-fyp-rw.firebaseio.com"
});

const express = require('express');
const app = express();

app.get('/tests', (request, response) => {
  admin.firestore()
    .collection('tests')
    .orderBy('name')
    .get()
    .then((data) => {
      let tests = [];
      data.forEach(doc => {
        tests.push({
          testId: doc.id,
          name: doc.name,
          description: doc.description,
          referenceRange: doc.referenceRange,
          requestForm: doc.requestForm,
          specialNotes: doc.specialNotes,
          specimenTypeVolume: doc.specimenTypeVolume,
          turnaroundTime: doc.turnaroundTime
        });
      });
      return response.json(tests);
    })
    .catch((err) => console.error("Error" + err));
})

app.post('/test', (request, response) => {
  const newTest = {
    name: request.body.name,
    description: request.body.description,
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

exports.api = functions.region('europe-west1').https.onRequest(app);