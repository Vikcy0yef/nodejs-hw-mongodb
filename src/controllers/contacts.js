
import createHttpError from "http-errors";
import {
    getAllContacts,
    getContactById,
    deleteContact
    
} from "../services/contacts.js";
import Contact from "../models/contact.js";



export const getContactsController = async (req, res) => {
    const {
        page = 1,
        perPage = 10,
        sortBy = "name",
        sortOrder = "asc",
        type,
        isFavourite,
    } = req.query;

    const { _id: userId } = req.user;

    const paginationData = await getAllContacts(
        Number(page),
        Number(perPage),
        sortBy,
        sortOrder,
        type,
        isFavourite,
        userId
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
    const { _id: userId } = req.user;
        const contact = await getContactById(contactId, userId);
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
  const { _id: userId } = req.user;
  const photoUrl = req.file ? req.file.path : null;

  const contact = await Contact.create({
    ...req.body,
    userId,
    photo: photoUrl,
  });

  return res.status(201).json({ status: 201, message: "Created", data: contact });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const data = { ...req.body };
  if (req.file) data.photo = req.file.path;

  const updated = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    { new: true }
  );

  if (!updated) throw createHttpError(404, "Contact not found");

  return res.json({ status: 200, message: "Updated", data: updated });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const deleted = await deleteContact(contactId, userId);
  if (!deleted) throw createHttpError(404, "Contact not found");

  return res.status(204).send();
};