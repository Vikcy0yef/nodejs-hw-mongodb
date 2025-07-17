import express from "express";
import cors from "cors";
import pino from "pino-http";
import controllersContacts from "./routers/contacts.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import authRouter from "./routers/auth.js";
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';


function setupServer() { 
    const app = express();

    app.use(cors());
    app.use(pino());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser())
    

    app.use('/contacts', controllersContacts);
    app.use("/auth", authRouter);
  
   const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'docs/swagger.json'), 'utf8'));
    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use(notFoundHandler); 
   
    app.use(errorHandler);
 
    return app
}

export default setupServer;