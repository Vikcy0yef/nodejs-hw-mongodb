import multer from "multer";
import path from "path";
import fs from "fs/promises";

const tempDir = path.resolve("temp");


await fs.mkdir(tempDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;