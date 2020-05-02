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

exports.validateTestData = (data) => {
  let errors = {};
  const emptyError = 'Must not be empty';
  if (isEmpty(data.name)) errors.name = emptyError;
  if (isEmpty(data.department)) errors.department = emptyError;
  if (isEmpty(data.requestForm)) errors.requestForm = emptyError;
  if (isEmpty(data.specimenType)) errors.specimenType = emptyError;
  if (isEmpty(data.specimenContainer)) errors.specimenContainer = emptyError;
  if (isEmpty(data.specimenVolume)) errors.specimenVolume = emptyError;
  if (isEmpty(data.turnaroundTime)) errors.turnaroundTime = emptyError;

  return {
    errors,
    valid: Object.keys(errors).length === 0
  }
};

exports.validateBloodProductData = (data) => {
  let errors = {};
  const emptyError = 'Must not be empty';
  if (isEmpty(data.product)) errors.product = emptyError;
  if (isEmpty(data.description)) errors.description = emptyError;
  if (isEmpty(data.shelfLife)) errors.shelfLife = emptyError;
  if (isEmpty(data.storagePrep)) errors.storagePrep = emptyError;
  if (isEmpty(data.storageTemp)) errors.storageTemp = emptyError;
  if (isEmpty(data.testingReq)) errors.testingReq = emptyError;
  if (isEmpty(data.volume)) errors.volume = emptyError;

  return {
    errors,
    valid: Object.keys(errors).length === 0
  }
};