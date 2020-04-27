const firebase = require('firebase');
const firebaseConfig = require('../utils/config');
firebase.initializeApp(firebaseConfig);
const {validateSignupData, validateLoginData} = require('../utils/validators');
const {db} = require('../utils/admin');


exports.signup = (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword
  };

  const {valid, errors} = validateSignupData(newUser);
  if (!valid) {
    return response.status(400).json(errors);
  }
  let newToken, userId;
  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((token) => {
      newToken = token;
      const userCredentials = {
        email: newUser.email,
        admin: false,
        userId: userId
      };
      return db.doc(`/users/${newUser.email}`).set(userCredentials);
    })
    .then(() => {
      return response.status(201).json({newToken});
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return response.status(400).json({email: 'Email is already in use'});
      }
      return response.status(500).json({general: 'Something went wrong, please try again'});
    });
};

exports.login = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password
  };

  const {valid, errors} = validateLoginData(user);
  if (!valid) {
    return response.status(400).json(errors);
  }

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return response.json({token});
    })
    .catch(err => {
      console.error(err);
      return response.status(403).json({general: 'Credentials not recognised, please try again'});
    });
};

// Get auth user details
exports.getAuthenticatedUser = (request, response) => {
  let userData = {};
  db.doc(`/users/${request.user.email}`).get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return response.json(userData);
      }
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    })
};
