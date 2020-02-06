const functions = require('firebase-functions');

require('dotenv');

const app = require('express')();
const {getAllTests, createTest} = require('./handlers/tests');
const {signup, login} = require('./handlers/users');
const FBAuth = require('./utils/fbAuth');

app.get('/tests', getAllTests);
app.post('/test', FBAuth, createTest);
// Signup route
app.post('/signup', signup);
// Login route
app.post('/login', login);

exports.api = functions.region('europe-west1').https.onRequest(app);