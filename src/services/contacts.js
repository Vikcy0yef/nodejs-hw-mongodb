const Contact = require('../models/contact');

async function getAllContacts() {
    
    return Contact.find({});
}

async function getContactById(contactId) {
    return Contact.findById(contactId);
}
module.exports = {getAllContacts, getContactById}