const {db} = require('../utils/admin');

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
          description: doc.data().description,
          referenceRange: doc.data().referenceRange,
          requestForm: doc.data().requestForm,
          specialNotes: doc.data().specialNotes,
          specimenTypeVolume: doc.data().specimenTypeVolume,
          turnaroundTime: doc.data().turnaroundTime
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
    description: request.body.description,
    referenceRange: request.body.referenceRange,
    requestForm: request.body.requestForm,
    specialNotes: request.body.specialNotes,
    specimenTypeVolume: request.body.specimenTypeVolume,
    turnaroundTime: request.body.turnaroundTime
  };

  db.collection("tests")
    .add(newTest)
    .then(doc => {
      response.json({ message: `Document ${doc.id} created successfully` });
    })
    .catch(err => {
      response.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
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