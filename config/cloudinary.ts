import { v2 as cloudinary } from "cloudinary";
import { config } from "./constants";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || config.CLOUDINARY.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || config.CLOUDINARY.API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || config.CLOUDINARY.API_SECRET,
});

export { cloudinary };
