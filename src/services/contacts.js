import Contact from'../models/contact.js';

export const getAllContacts = async (
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
    type,
    isFavourite,
    userId
) => {
    const skip = (page - 1) * perPage;
    const sortDirection = sortOrder === "desc" ? -1:1;

    const filter = {userId};
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

export async function getContactById(contactId, userId) {
   
    return Contact.findOne({_id:contactId, userId});
}

 export async function createContact({ name, phoneNumber, email, isFavourite = false,contactType, userId }) {
    const newContact = await Contact.create({
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType,
        userId
    })
    return newContact;
}

export const updateContact = async (contactId, data, userId) => {
    return await Contact.findOneAndUpdate(
      { _id: contactId, userId },
      data,
      { new: true }
    );
  };

  export const deleteContact = async (contactId, userId) => {
    return await Contact.findOneAndDelete({ _id: contactId, userId });
  };
  