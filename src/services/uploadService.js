import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();
// console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_API_SECRET);

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (filePath) => {
  
  return new Promise((resolve, reject) => {
    
    cloudinary.uploader.upload(filePath, { folder: 'contacts_photos' }, (error, result) => {
      
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });

      if (error) return reject(error);
      resolve(result);
    });
  });
};