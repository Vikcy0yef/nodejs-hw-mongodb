import Contact from'../models/contact.js';

export async function getAllContacts() {
    
    return Contact.find({});
}

export async function getContactById(contactId) {
    return Contact.findById(contactId);
}

 export async function createContact({ name, phoneNumber, email, isFavourite = false,contactType }) {
    const newContact = await Contact.create({
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType,
    })
    return newContact;
}

export async function updateContact(contactId, data) {
    const updateContact = await Contact.findByIdAndUpdate(contactId, data, {
        new: true,
    });
    return updateContact;
}

export async function deleteContact(contactId) {
    const result = await Contact.findByIdAndDelete(contactId);
    return result;
}