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

exports.createQuiz = (request, response) => {
  const newQuiz = {
    title: request.body.quizName,
    description: request.body.quizDescription,
    questions: request.body.questions
  };
  db.collection("quizzes")
    .add(newQuiz)
    .then(doc => {
      const responseQuiz = newQuiz;
      responseQuiz.quizId = doc.id;
      response.json(responseQuiz);
    })
    .catch(err => {
      response.status(500).json({ general: "Something went wrong" });
      console.error(err);
    });
};

exports.deleteQuiz = (request, response) => {
  const quiz = db.doc(`/quizzes/${request.params.quizId}`);
  quiz.get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({error: 'Quiz not found'});
      }
      return quiz.delete();
    })
    .then(() => {
      response.json({message: 'Quiz deleted successfully'});
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({error: err.code});
    })
};

exports.getQuizResults = (request, response) => {
  db.collection("quizResults")
    .orderBy("createdOn")
    .get()
    .then(data => {
      let quizResults = [];
      data.forEach(doc => {
        quizResults.push({
          quizResultId: doc.id,
          quizName: doc.data().quizName,
          score: doc.data().score,
          userEmail: doc.data().userEmail,
          createdOn: doc.data().createdOn
        });
      });
      return response.json(quizResults);
    })
    .catch(err => {
      console.error("Error" + err);
      response.status(500).json({ error: err.code });
    });
};

exports.addQuizResult = (request, response) => {
  const newResult = {
    createdOn: new Date().toISOString(),
    quizName: request.body.quizName,
    score: request.body.score,
    userEmail: request.body.userEmail
  };
  db.collection("quizResults")
    .add(newResult)
    .then(doc => {
      const responseResult = newResult;
      responseResult.quizResultId = doc.id;
      response.json(responseResult);
    })
    .catch(err => {
      response.status(500).json({ error: err.code });
    });
};