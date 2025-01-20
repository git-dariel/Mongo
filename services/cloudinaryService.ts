import { cloudinary } from "../config/cloudinary";
import { AppError } from "../middleware/errorHandler";

export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: "user-avatars",
        use_filename: true,
        unique_filename: true,
        overwrite: true,
      });

      return result.secure_url;
    } catch (error) {
      throw new AppError("Error uploading image to Cloudinary", 500);
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new AppError("Error deleting image from Cloudinary", 500);
    }
  }
}
