const {db} = require('../utils/admin');
const {validateNewsData} = require('../utils/validators');

exports.getAllNewsItems = (request, response) => {
  db.collection("newsItems")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let newsItems = [];
      data.forEach(doc => {
        newsItems.push({
          newsItemId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          author: doc.data().author,
          createdAt: doc.data().createdAt
        });
      });
      return response.json(newsItems);
    })
    .catch(err => {
      console.error("Error" + err);
      response.status(500).json({ error: err.code });
    });
};

exports.getNewsItem = (request, response) => {
  let newsItemData = {};
  db.doc(`/newsItems/${request.params.newsItemId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({error: 'News item not found'});
      }
      newsItemData = doc.data();
      newsItemData.newsItemId = doc.id;
      return response.json(newsItemData);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({error: err.code});
    })
};

exports.createNewsItem = (request, response) => {
  const newNewsItem = {
    title: request.body.title,
    body: request.body.body,
    createdAt: new Date().toISOString(),
    author: request.body.author
  };

  const {valid, errors} = validateNewsData(newNewsItem);
  if (!valid) {
    return response.status(400).json(errors);
  }
  db.collection("newsItems")
    .add(newNewsItem)
    .then(doc => {
      const responseNewsItem = newNewsItem;
      responseNewsItem.newsItemId = doc.id;
      response.json(responseNewsItem);
    })
    .catch(err => {
      response.status(500).json({ general: "Something went wrong" });
      console.error(err);
    });
};

exports.updateNewsItem = (request, response) => {
  const editNewsItem = {
    title: request.body.title,
    body: request.body.body
  };
  const {valid, errors} = validateNewsData(editNewsItem);
  if (!valid) {
    return response.status(400).json(errors);
  }
  const newsItem = db.doc(`/newsItems/${request.params.newsItemId}`);
  newsItem.update(editNewsItem)
    .then(() => {
      return response.json({ message: 'News Item updated successfully' });
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    })
};

exports.deleteNewsItem = (request, response) => {
  const newsItem = db.doc(`/newsItems/${request.params.newsItemId}`);
  newsItem.get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({error: 'News Item not found'});
      }
      return newsItem.delete();
    })
    .then(() => {
      response.json({message: 'News Item deleted successfully'});
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({error: err.code});
    })
};