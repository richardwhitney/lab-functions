const {db} = require('../utils/admin');

exports.getAllClinicalPathways = (request, response) => {
  db.collection("clinicalPathways")
    .orderBy("title")
    .get()
    .then(data => {
      let clinicalPathways = [];
      data.forEach(doc => {
        clinicalPathways.push({
          clinicalPathwayId: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          nodes: doc.data().nodes
        });
      });
      return response.json(clinicalPathways);
    })
    .catch(err => {
      console.error("Error" + err);
      response.status(500).json({ error: err.code });
    });
};

exports.getClinicalPathway = (request, response) => {
  let clinicalPathwayData = {};
  db.doc(`/clinicalPathways/${request.params.clinicalPathwayId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: 'Clinical pathway not found' });
      }
      clinicalPathwayData = doc.data();
      clinicalPathwayData.clinicalPathwayId = doc.id;
      return response.json(clinicalPathwayData);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({ error: err.code });
    })
};