import "server-only";
import { v2 as cloudinary } from "cloudinary";

export const projectImageFolder = process.env.CLOUDINARY_FOLDER ?? "sibsankar-portfolio/projects";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function removeCloudinaryImage(publicId: string) {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET)
    return;
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

export async function uploadProjectImage(file: string) {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary is not configured.");
  }

  const image = await cloudinary.uploader.upload(file, {
    folder: projectImageFolder,
    resource_type: "image",
  });

  return { image_url: image.secure_url, public_id: image.public_id };
}
