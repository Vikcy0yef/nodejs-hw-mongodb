import mongoose from "mongoose";

async function initMongoConnection() {
    const {
        MONGODB_USER,
        MONGODB_PASSWORD,
        MONGODB_URL,
        MONGODB_DB
    } = process.env;
      const mongoUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
      console.log('MongoDB URI:', mongoUri);

    try {
        await mongoose.connect(mongoUri);
        console.log('Mongo connection successfully established!');
    } catch (error) {
        console.error('Mongo connection error:', error.message);
        process.exit(1);
    }
};
export default initMongoConnection;
