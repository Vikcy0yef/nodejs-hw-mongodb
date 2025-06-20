import express from "express";
import cors from "cors";
import pino from "pino-http";
import controllersContacts from "./routers/contacts.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";

function setupServer() { 
    const app = express();

    app.use(cors());
    app.use(pino());
    app.use(express.json());

    app.use('/contacts', controllersContacts);
   
  
    app.use(notFoundHandler); 
   
    app.use(errorHandler);
 
    return app
}

export default setupServer;