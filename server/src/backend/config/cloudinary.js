import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config(); // Make sure .env is loaded

// ✅ Configure Cloudinary from your .env
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chatly_uploads", // Folder name inside your Cloudinary account
    resource_type: "auto",    // Automatically handles images/videos
  },
});

export const upload = multer({ storage });
export default cloudinary;
