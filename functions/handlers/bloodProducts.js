const {db} = require('../utils/admin');
const {validateTestData, validateBloodProductData} = require('../utils/validators');

exports.getAllBloodProducts = (request, response) => {
  db.collection("bloodProducts")
    .orderBy("product")
    .get()
    .then(data => {
      let products = [];
      data.forEach(doc => {
        products.push({
          productId: doc.id,
          product: doc.data().product,
          description: doc.data().description,
          shelfLife: doc.data().shelfLife,
          storagePrep: doc.data().storagePrep,
          storageTemp: doc.data().storageTemp,
          testingReq: doc.data().testingReq,
          volume: doc.data().volume
        });
      });
      return response.json(products);
    })
    .catch(err => {
      console.error("Error" + err);
      response.status(500).json({ error: err.code });
    });
};

exports.getBloodProduct = (request, response) => {
  let productData = {};
  db.doc(`/bloodProducts/${request.params.testId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({error: 'Blood product not found'});
      }
      productData = doc.data();
      productData.productId = doc.id;
      return response.json(productData);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({error: err.code});
    })
};

exports.createBloodProduct = (request, response) => {
  const newBloodProduct = {
    product: request.body.product,
    description: request.body.description,
    shelfLife: request.body.shelfLife,
    storagePrep: request.body.storagePrep,
    storageTemp: request.body.storageTemp,
    testingReq: request.body.testingReq,
    volume: request.body.volume
  };

  const {valid, errors} = validateBloodProductData(newBloodProduct);
  if (!valid) {
    return response.status(400).json(errors);
  }
  db.collection("bloodProducts")
    .add(newBloodProduct)
    .then(doc => {
      const responseBloodProduct = newBloodProduct;
      responseTest.productId = doc.id;
      response.json(responseBloodProduct);
    })
    .catch(err => {
      response.status(500).json({ general: "Something went wrong" });
      console.error(err);
    });
};

exports.updateBloodProduct = (request, response) => {
  const editBloodProduct = {
    product: request.body.product,
    description: request.body.description,
    shelfLife: request.body.shelfLife,
    storagePrep: request.body.storagePrep,
    storageTemp: request.body.storageTemp,
    testingReq: request.body.testingReq,
    volume: request.body.volume
  };
  const {valid, errors} = validateBloodProductData(editBloodProduct);
  if (!valid) {
    return response.status(400).json(errors);
  }
  const bloodProduct = db.doc(`/bloodProducts/${request.params.productId}`);
  bloodProduct.update(editBloodProduct)
    .then(() => {
      return response.json({ message: 'Blood product updated successfully' });
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    })
};

exports.deleteBloodProduct = (request, response) => {
  const bloodProduct = db.doc(`/bloodProducts/${request.params.productId}`);
  bloodProduct.get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({error: 'Blood product not found'});
      }
      return bloodProduct.delete();
    })
    .then(() => {
      response.json({message: 'Blood product deleted successfully'});
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({error: err.code});
    })
};