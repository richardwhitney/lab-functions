const firebase = require('firebase');
const firebaseConfig = require('../utils/config');
firebase.initializeApp(firebaseConfig);
const {validateSignupData, validateLoginData} = require('../utils/validators');


exports.signup = (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    handle: request.body.handle
  };

  const {valid, errors} = validateSignupData(newUser);
  if (!valid) {
    return response.status(400).json(errors);
  }
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
