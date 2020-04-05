const {db} = require('../utils/admin');
const {validateTestData} = require('../utils/validators');

exports.getAllTests = (request, response) => {
  db.collection("tests")
    .orderBy("name")
    .get()
    .then(data => {
      let tests = [];
      data.forEach(doc => {
        tests.push({
          testId: doc.id,
          name: doc.data().name,
          department: doc.data().department,
          requestForm: doc.data().requestForm,
          specimenType: doc.data().specimenType,
          specimenContainer: doc.data().specimenContainer,
          specimenVolume: doc.data().specimenVolume,
          specimenRequirements: doc.data().specimenRequirements,
          turnaroundTime: doc.data().turnaroundTime,
          phoneAlertLimits: doc.data().phoneAlertLimits,
          specialNotes: doc.data().specialNotes
        });
      });
      return response.json(tests);
    })
    .catch(err => {
      console.error("Error" + err);
      response.status(500).json({ error: err.code });
    });
};

exports.getTest = (request, response) => {
  let testData = {};
  db.doc(`/tests/${request.params.testId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({error: 'Test not found'});
      }
      testData = doc.data();
      testData.testId = doc.id;
      return response.json(testData);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({error: err.code});
    })
};

exports.createTest = (request, response) => {
  const newTest = {
    name: request.body.name,
    department: request.body.department,
    requestForm: request.body.requestForm,
    specimenType: request.body.specimenType,
    specimenContainer: request.body.specimenContainer,
    specimenVolume: request.body.specimenVolume,
    specimenRequirements: request.body.specimenRequirements,
    turnaroundTime: request.body.turnaroundTime,
    phoneAlertLimits: request.body.phoneAlertLimits,
    specialNotes: request.body.specialNotes
  };

  const {valid, errors} = validateTestData(newTest);
  if (!valid) {
    return response.status(400).json(errors);
  }
  db.collection("tests")
    .add(newTest)
    .then(doc => {
      const responseTest = newTest;
      responseTest.testId = doc.id;
      response.json(responseTest
      );
    })
    .catch(err => {
      response.status(500).json({ general: "Something went wrong" });
      console.error(err);
    });
};

exports.updateTest = (request, response) => {
  const editTest = {
    name: request.body.name,
    department: request.body.department,
    requestForm: request.body.requestForm,
    specimenType: request.body.specimenType,
    specimenContainer: request.body.specimenContainer,
    specimenVolume: request.body.specimenVolume,
    specimenRequirements: request.body.specimenRequirements,
    turnaroundTime: request.body.turnaroundTime,
    phoneAlertLimits: request.body.phoneAlertLimits,
    specialNotes: request.body.specialNotes
  };
  const {valid, errors} = validateTestData(editTest);
  if (!valid) {
    return response.status(400).json(errors);
  }
  const test = db.doc(`/tests/${request.params.testId}`);
  test.update(editTest)
    .then(() => {
      return response.json({ message: 'Test updated successfully' });
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    })
};

exports.deleteTest = (request, response) => {
  const test = db.doc(`/tests/${request.params.testId}`);
  test.get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({error: 'Test not found'});
      }
      return test.delete();
    })
    .then(() => {
      response.json({message: 'Test deleted successfully'});
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({error: err.code});
    })
};