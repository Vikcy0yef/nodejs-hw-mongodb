import Contact from'../models/contact.js';

export const getAllContacts = async (
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
    type,
    isFavourite
) => {
    const skip = (page - 1) * perPage;
    const sortDirection = sortOrder === "desc" ? -1:1;

    const filter = {};
    if (type) filter.contactType = type;
    if (typeof isFavourite !== "undefined") {
        filter.isFavourite = isFavourite === "true";
    }


    const totalItems = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / perPage);

    const contacts = await Contact.find(filter)
        .sort({ [sortBy]: sortDirection})
        .skip(skip)
        .limit(perPage);
    

  
    return {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
    };
};

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