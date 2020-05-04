const functions = require('firebase-functions');

require('dotenv');

const app = require('express')();
const {getAllTests, getTest, createTest, deleteTest, updateTest} = require('./handlers/tests');
const {signup, login, getAuthenticatedUser} = require('./handlers/users');
const {getAllQuizzes, getQuiz, getQuizResults, addQuizResult, createQuiz} = require('./handlers/quizzes');
const {getAllBloodProducts, getBloodProduct, createBloodProduct, deleteBloodProduct, updateBloodProduct} = require('./handlers/bloodProducts');
const {getAllContacts, getContact, createContact, deleteContact, updateContact} = require('./handlers/contacts');
const FBAuth = require('./utils/fbAuth');

const cors = require('cors');
app.use(cors());
// Test routes
app.get('/tests', getAllTests);
app.get('/tests/:testId', getTest);
app.post('/test', FBAuth, createTest);
app.delete('/test/:testId', FBAuth, deleteTest);
app.put('/test/:testId', FBAuth, updateTest);
// User routes
app.post('/signup', signup);
app.post('/login', login);
app.get('/user', FBAuth, getAuthenticatedUser);
// Quiz routes
app.get('/quizzes', FBAuth, getAllQuizzes);
app.get('/quizzes/:quizId', FBAuth, getQuiz);
app.post('/quiz', FBAuth, createQuiz);
app.get('/quizResults', FBAuth, getQuizResults);
app.post('/quizResults', FBAuth, addQuizResult);
// Blood product routes
app.get('/bloodProducts', FBAuth, getAllBloodProducts);
app.get('/bloodProducts/:productId', FBAuth, getBloodProduct);
app.post('/bloodProduct', FBAuth, createBloodProduct);
app.delete('/bloodProduct/:productId', FBAuth, deleteBloodProduct);
app.put('/bloodProduct/:productId', FBAuth, updateBloodProduct);
// Contacts
app.get('/contacts', FBAuth, getAllContacts);
app.get('/contacts/:contactId', FBAuth, getContact);
app.post('/contact', FBAuth, createContact);
app.delete('/contact/:contactId', FBAuth, deleteContact);
app.put('/contact/:contactId', FBAuth, updateContact);

exports.api = functions.region('europe-west1').https.onRequest(app);