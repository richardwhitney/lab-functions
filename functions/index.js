const functions = require('firebase-functions');

require('dotenv');

const app = require('express')();
const {getAllTests, getTest, createTest, deleteTest} = require('./handlers/tests');
const {signup, login} = require('./handlers/users');
const FBAuth = require('./utils/fbAuth');

app.get('/tests', getAllTests);
app.get('/tests/:testId', getTest);
app.post('/test', FBAuth, createTest);
// TODO delete test
app.delete('/test/:testId', FBAuth, deleteTest);
// TODO update test
// Signup route
app.post('/signup', signup);
// Login route
app.post('/login', login);

exports.api = functions.region('europe-west1').https.onRequest(app);