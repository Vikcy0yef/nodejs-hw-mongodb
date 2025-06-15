import express from "express";
import cors from "cors";
import pino from "pino-http";
import contactsController from './controllers/contactsController.js'

function setupServer() { 
    const app = express();

    app.use(cors());
    app.use(pino());
    app.use(express.json())
    app.get('/contacts', contactsController.getContacts);
    app.get('/contacts/:contactId', contactsController.getContactById);
  
    app.use((req, res) => {
        res.status(404).json({ message: "Not found" });
    });
   
    return app
}

export default setupServer;