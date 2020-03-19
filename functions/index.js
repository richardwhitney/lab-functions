const functions = require('firebase-functions');

require('dotenv');

const app = require('express')();
const {getAllTests, getTest, createTest, deleteTest, updateTest} = require('./handlers/tests');
const {signup, login} = require('./handlers/users');
const FBAuth = require('./utils/fbAuth');

const cors = require('cors');
app.use(cors());

app.get('/tests', getAllTests);
app.get('/tests/:testId', getTest);
app.post('/test', FBAuth, createTest);
// TODO delete test
app.delete('/test/:testId', FBAuth, deleteTest);
// TODO update test
app.put('/test/:testId', FBAuth, updateTest);
// Signup route
app.post('/signup', signup);
// Login route
app.post('/login', login);

exports.api = functions.region('europe-west1').https.onRequest(app);