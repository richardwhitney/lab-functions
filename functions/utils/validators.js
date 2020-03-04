const isEmpty = (string) => {
  return string.trim() === '';
};

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !!email.match(regEx);
};

exports.validateSignupData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty'
  } else  if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address'
  }
  if (isEmpty(data.password)) {
    errors.password = 'Must not be empty'
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords must match'
  }
  if (isEmpty(data.handle)) {
    errors.handle = 'Must not be empty'
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0
  }
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  return {
    errors,
    valid: Object.keys(errors).length === 0
  }
};

exports.validateTestDate = (data) => {
  let errors = {};
  const emptyError = 'Must not be empty';
  if (isEmpty(data.name)) errors.name = emptyError;
  if (isEmpty(data.description)) errors.description = emptyError;
  if (isEmpty(data.referenceRange)) errors.referenceRange = emptyError;
  if (isEmpty(data.requestForm)) errors.requestForm = emptyError;
  if (isEmpty(data.specialNotes)) errors.specialNotes = emptyError;
  if (isEmpty(data.specimenTypeVolume)) errors.specimenTypeVolume = emptyError;
  if (isEmpty(data.turnaroundTime)) errors.turnaroundTime = emptyError;

  return {
    errors,
    valid: Object.keys(errors).length === 0
  }
};