const {db} = require('../utils/admin');

exports.getAllQuizzes = (request, response) => {
  db.collection("quizzes")
    .orderBy("title")
    .get()
    .then(data => {
      let quizzes = [];
      data.forEach(doc => {
        quizzes.push({
          quizId: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          questions: doc.data().questions
        });
      });
      return response.json(quizzes);
    })
    .catch(err => {
      console.error("Error" + err);
      response.status(500).json({ error: err.code });
    });
};

exports.getQuiz = (request, response) => {
  let quizData = {};
  db.doc(`/quizzes/${request.params.quizId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({ error: 'Quiz not found '});
      }
      quizData = doc.data();
      quizData.quizId = doc.id;
      return response.json(quizData);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({ error: err.code });
    })
};