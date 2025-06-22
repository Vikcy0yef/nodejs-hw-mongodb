
import createHttpError from "http-errors"
import {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
    
} from "../services/contacts.js"

export const getContactsController = async (req, res) => {
    const {
        page = 1,
        perPage = 10,
        sortBy = "name",
        sortOther = "asc",
    } = req.query;

    const paginationData = await getAllContacts(
        Number(page),
        Number(perPage),
        sortBy,
        sortOther
    );
  
        if (!paginationData.data.length) {
          throw createHttpError(404, 'Contact not found');
        }
      
        res.json({
          status: 200,
          message: 'Successfully found contacts!',
          data: paginationData,
        });   
   
    
  };

export const getContactByIdController = async (req, res) => {
    
        const { contactId } = req.params;
        const contact = await getContactById(contactId);
        if (!contact) {
            throw createHttpError(404, 'Contact not found')
        };
        res.json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });  
    
    
};

export const createContactController = async (req, res) => {
   
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
   
};
  
export const updateContactController = async (req, res) => {
   
        const { contactId } = req.params;
        const updatedContact = await updateContact(contactId, req.body);
        if (!updatedContact) {
            throw createHttpError(404, 'Contact not found');
        }
        res.status(200).json({
            status: 200,
            message: "Successfully patched a contact!",
            data: updatedContact,
        });
   
}


export const deleteContactController = async (req, res) => {
   
        const { contactId } = req.params;
        const deleted =await deleteContact(contactId);

        if (!deleted) {
            throw createHttpError(404, 'Contact not found');
        }
        res.status(204).send();
   
}