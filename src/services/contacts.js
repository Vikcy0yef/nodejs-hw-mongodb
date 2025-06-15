import Contact from'../models/contact.js';

async function getAllContacts() {
    
    return Contact.find({});
}

async function getContactById(contactId) {
    return Contact.findById(contactId);
}
export default {getAllContacts, getContactById}