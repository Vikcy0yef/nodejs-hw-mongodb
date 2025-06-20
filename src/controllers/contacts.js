
import createHttpError from "http-errors"
import {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
    
} from "../services/contacts.js"

export const getContactsController = async (req, res, next) => {
    try {
        const contacts = await getAllContacts();
  
        if (!contacts||contacts.length===0) {
          throw createHttpError(404, 'Contact not found');
        }
      
        res.json({
          status: 200,
          message: 'Successfully found contacts!',
          data: contacts,
        });   
    } catch (error) {
        next(error);
    }
    
  };

export const getContactByIdController = async (req, res,next) => {
    try {
        const { contactId } = req.params;
        const contact = await getContactById(contactId);
        if (!contact) {
            throw createHttpError(404, 'Contact not found')
        };
        res.json({
            status: 200,
            message: `Successfully found student with id ${contactId}!`,
            data: contact,
        });  
    } catch (error) {
        next(error);
    }
    
};

export const createContactController = async (req, res, next) => {
    try {
        const { name, phoneNumber, email, isFavourite, contactType } = req.body;
        if (!name || !phoneNumber || !contactType) {
            throw createHttpError(400, 'Missing required fields:name, phoneNumber or contactType')
        }
        const newContact = await createContact({ name, phoneNumber, email, isFavourite, contactType });
        res.status(201).json({
            status: 201,
            message: 'Successfully created a contact!',
            data: newContact,
        });
    } catch (error) {
        next(error)
    }
};
  
export const updateContactController = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const updatedContact = await updateContact(contactId, req.body);
        if (!updatedContact) {
            throw createHttpError(404, 'Contact not fount');
        }
        res.status(200).json({
            status: 200,
            message: "Successfully patched a contact!",
            data: updateContact,
        });
    } catch (error) {
        next(error);
    }
}


export const deleteContactController = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const deleted =await deleteContact(contactId);

        if (!deleted) {
            throw createHttpError(404, 'Contact not found');
        }
        res.status(204).send();
    } catch (error) {
        next(error)
    }
}