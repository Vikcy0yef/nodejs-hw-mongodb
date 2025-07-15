
import createHttpError from "http-errors";
import {
    getAllContacts,
    getContactById,
  
    updateContact,
    deleteContact
    
} from "../services/contacts.js";
import Contact from "../models/contact.js";
import { uploadToCloudinary } from "../services/uploadService.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";

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


export const updateContactController = async (req, res) => {
   
    const { contactId } = req.params;
    const { _id: userId } = req.user;
        const updatedContact = await updateContact(contactId, req.body,userId);
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
    const { _id: userId } = req.user;
        const deleted =await deleteContact(contactId,userId);

        if (!deleted) {
            throw createHttpError(404, 'Contact not found');
        }
        res.status(204).send();
   
}

export const createContactController = ctrlWrapper(async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  const { name, email, phoneNumber, contactType } = req.body;
  let isFavourite = req.body.isFavourite === 'true'; 

  let photoUrl = null;
  if (req.file) {
   
    const result = await uploadToCloudinary(req.file.path);
    photoUrl = result.secure_url; 
  }

  const { _id: userId } = req.user;

  const newContact = await Contact.create({
    name,
    email,
    phoneNumber,
    contactType,
    isFavourite,
    photo: photoUrl,
    userId,
  });

  res.status(201).json({
    status: 201,
    data: newContact,
  });
});