const {db} = require('../utils/admin');
const {validateContactData} = require('../utils/validators');

exports.getAllContacts = (request, response) => {
  db.collection("contacts")
    .orderBy("name")
    .get()
    .then(data => {
      let contacts = [];
      data.forEach(doc => {
        contacts.push({
          contactId: doc.id,
          name: doc.data().name,
          department: doc.data().department,
          phone: doc.data().phone
        });
      });
      return response.json(contacts);
    })
    .catch(err => {
      console.error("Error" + err);
      response.status(500).json({ error: err.code });
    });
};

exports.getContact = (request, response) => {
  let contactData = {};
  db.doc(`/contacts/${request.params.contactId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({error: 'Contact not found'});
      }
      contactData = doc.data();
      contactData.contactId = doc.id;
      return response.json(contactData);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({error: err.code});
    })
};

exports.createContact = (request, response) => {
  const newContact = {
    name: request.body.name,
    phone: request.body.phone,
    department: request.body.department
  };

  const {valid, errors} = validateContactData(newContact);
  if (!valid) {
    return response.status(400).json(errors);
  }
  db.collection("contacts")
    .add(newContact)
    .then(doc => {
      const responseContact = newContact;
      responseContact.contactId = doc.id;
      response.json(responseContact);
    })
    .catch(err => {
      response.status(500).json({ general: "Something went wrong" });
      console.error(err);
    });
};

exports.updateContact = (request, response) => {
  const editContact = {
    name: request.body.name,
    phone: request.body.phone,
    department: request.body.department
  };
  const {valid, errors} = validateContactData(editContact);
  if (!valid) {
    return response.status(400).json(errors);
  }
  const contact = db.doc(`/contacts/${request.params.contactId}`);
  contact.update(editContact)
    .then(() => {
      return response.json({ message: 'Contact updated successfully' });
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    })
};

exports.deleteContact = (request, response) => {
  const contact = db.doc(`/contacts/${request.params.contactId}`);
  contact.get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({error: 'Contact not found'});
      }
      return contact.delete();
    })
    .then(() => {
      response.json({message: 'Contact deleted successfully'});
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({error: err.code});
    })
};