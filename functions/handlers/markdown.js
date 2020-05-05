const {db} = require('../utils/admin');

exports.getMarkdown = (request, response) => {
  let markdownData = {};
  db.doc(`/markdown/${request.params.markdownId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({error: 'Markdown not found'});
      }
      markdownData = doc.data();
      markdownData.markdownId = doc.id;
      return response.json(markdownData);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({error: err.code});
    })
};

exports.updateMarkdown = (request, response) => {
  const editMarkdown = {
    body: request.body.body
  };
  const markdown = db.doc(`/markdown/${request.params.markdownId}`);
  markdown.update(editMarkdown)
    .then(() => {
      return response.json({ message: 'Markdown updated successfully' });
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    })
};