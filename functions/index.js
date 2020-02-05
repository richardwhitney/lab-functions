const functions = require('firebase-functions');
const admin = require('firebase-admin');
require('dotenv');
const serviceAccount = require("./lab-fyp-rw-f55f36454a34");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lab-fyp-rw.firebaseio.com"
});

const app = require('express')();
const db = admin.firestore();

var firebaseConfig = {
  apiKey: "AIzaSyAdeDJb7BesLOcfHvEB6z-zNHatrhfzojk",
  authDomain: "lab-fyp-rw.firebaseapp.com",
  databaseURL: "https://lab-fyp-rw.firebaseio.com",
  projectId: "lab-fyp-rw",
  storageBucket: "lab-fyp-rw.appspot.com",
  messagingSenderId: "81018625605",
  appId: "1:81018625605:web:db87a216a35f7ad7838d2c",
  measurementId: "G-D7GC08D760"
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

app.get('/tests', (request, response) => {
  db
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

  db
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

// Signup route
app.post('/signup', (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmpPassword: request.body.confirmpPassword,
    handle: request.body.handle
  };
  // TODO validate data
  let errors = {};

  if (isEmpty(newUser.email)) {
    errors.email = 'Must not be empty'
  } else  if (!isEmail(newUser.email)) {
    errors.email = 'Must be a valid email address'
  }
  if (isEmpty(newUser.password)) {
    errors.password = 'Must not be empty'
  }
  if (newUser.password !== newUser.confirmpPassword) {
    errors.confirmPassword = 'Passwords must match'
  }
  if (isEmpty(newUser.handle)) {
    errors.handle = 'Must not be empty'
  }
  if (Object.keys(errors).length > 0) return response.status(400).json(errors);

  let newToken;
  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then((token) => {
      newToken = token;
      return response.status(201).json({token});
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return response.status(400).json({email: 'Email is already in use'});
      }
      return response.status(500).json({error: err.code});
    });
});

// Login route
app.post('/login', (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password
  };

  let errors = {};

  if (isEmpty(user.email)) errors.email = 'Must not be empty';
  if (isEmpty(user.password)) errors.password = 'Must not be empty';
  if (Object.keys(errors).length > 0) return response.status(400).json(errors);

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return response.json({token});
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        return response.status(403).json({general: 'Email not recognised, please try again'});
      }
      if (err.code === 'auth/wrong-password') {
        return response.status(403).json({general: 'Credentials not recognised, please try again'});
      }
      return response.status(500).json({error: err.code});
    })
});

const isEmpty = (string) => {
  return string.trim() === '';
};

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !!email.match(regEx);
};

exports.api = functions.region('europe-west1').https.onRequest(app);