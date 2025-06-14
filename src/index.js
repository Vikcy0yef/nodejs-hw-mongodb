require('dotenv').config();


const setupServer = require("./server");
const initMongoConnection = require('./db/initMongoConnection');
const Contact = require('./models/contact')
const contacts = require('./contacts.json')
async function start() {
    await initMongoConnection();
    setupServer(); 
    try {
        const existingCount = await Contact.countDocuments();
        if (existingCount === 0) {
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