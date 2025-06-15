import dotenv from "dotenv";
dotenv.config();
import setupServer from"./server.js";
import initMongoConnection from'./db/initMongoConnection.js';
import Contact from'./models/contact.js'
import fs from 'fs/promises';

async function loadContacts() {
  const data = await fs.readFile(new URL('./contacts.json', import.meta.url));
  return JSON.parse(data);
}

async function start() {
    await initMongoConnection();
    setupServer(); 
    try {
        const existingCount = await Contact.countDocuments();
        if (existingCount === 0) {
            const contacts = await loadContacts();
            await Contact.insertMany(contacts);
            console.log('Contacts imported successfully');
        } else {
            console.log('Contacts already exist in database');
        }
    } catch (error) {
        
        console.error('Error importing contacts:', error.message);
}
}

start();