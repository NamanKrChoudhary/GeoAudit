import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

/**
 * Uploads a local file to Cloudinary and deletes the local copy.
 * @param {string} localFilePath - Path to the file in 'uploads/'
 * @param {string} folder - Folder name in Cloudinary (default: 'geo-audit')
 * @returns {Promise<Object>} - The secure URL and publicID
 */
export const uploadToCloud = async (localFilePath, folder = "geo-audit") => {
  try {
    // FIX: Configure Cloudinary HERE (Lazily), right before we use it.
    // This ensures dotenv has finished loading variables from .env
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!localFilePath) return null;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: folder,
      resource_type: "auto", // Auto-detect (image, pdf, etc.)
    });

    // If upload successful, delete the local file (cleanup)
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    // Cleanup: Even if upload fails, delete the local file so it doesn't pile up
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Cloudinary Upload Error:", error.message);
    throw new Error("Image upload failed");
  }
};

/**
 * Deletes an image from Cloudinary (useful if an Admin deletes an Area).
 * @param {string} publicId - The unique ID of the image in Cloudinary
 */
export const deleteFromCloud = async (publicId) => {
  try {
    // Config here as well just in case this is called independently
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image from Cloud: ${publicId}`);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error.message);
    // We don't throw here to avoid crashing the whole process just for a cleanup fail
  }
};
