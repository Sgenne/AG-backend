import sharp from "sharp";

import { IImageDocument, Image } from "../models/image";
import { IImage } from "../interfaces/image.interface";
import {
  DATABASE_ERROR,
  FILE_SYSTEM_ERROR,
  RESOURCE_ALREADY_EXISTS,
  RESOURCE_NOT_FOUND,
} from ".";
import { StorageHandler } from "../utils/storage.util";

const keyFileName: string | undefined = process.env.GOOGLE_CLOUD_KEY_FILENAME;
const bucketName: string | undefined = process.env.GOOGLE_CLOUD_BUCKET;

if (!(keyFileName && bucketName)) {
  throw new Error("Invalid google cloud credentials.");
}

const storage = new StorageHandler(keyFileName, bucketName);

// Fetches images from db with the given search query, if one is provided.
const fetchImages = async (searchQuery = {}) => {
  let images: IImage[] | null;

  try {
    images = await Image.find(searchQuery);
  } catch (error) {
    return { success: false, message: DATABASE_ERROR };
  }

  return { success: true, images: images };
};

/**
 * Returns all images.
 *
 * @returns {success: true, images} if images were fetched successfully.
 *
 * @returns {success: false, message} if the images could not be fetched.
 */
export const getImages = async (): Promise<{
  success: boolean;
  message?: string;
  images?: IImage[];
}> => {
  return fetchImages();
};

/**
 * Returns all images within a given category.
 *
 * @param category The category containing all returned images.
 *
 * @returns { success: true, images} if all images within the
 * given category were returned successfully (even if no images
 * are found).
 *
 * @returns { success: false, message} if the images could not be fetched.
 */
export const getImagesByCategory = async (
  category: string
): Promise<{
  success: boolean;
  message?: string;
  images?: IImage[];
}> => {
  return fetchImages({
    category: { $regex: new RegExp("^" + category.toLowerCase(), "i") }, // case insensitive
  });
};

/**
 * Returns the image with the given image-id, if one exists.
 * @param imageId The image-id of the returned image.
 */
export const getImageById = async (
  imageId: string
): Promise<{
  success: boolean;
  image?: IImage;
  message?: string;
}> => {
  let image: IImage | null;

  try {
    image = await Image.findById(imageId);
  } catch (error) {
    return { success: false, message: DATABASE_ERROR };
  }

  if (!image) return { success: false, message: RESOURCE_NOT_FOUND };

  return { success: true, image: image };
};

interface imageFile {
  originalname: string;
  buffer: Buffer;
}

/**
 * Stores an image in the file system and saves a corresponding
 * element in the database.
 *
 * @param image The image to be stored.
 *
 * @param category The category of the image.
 *
 * @returns { success: false, message } if the image could not be stored.
 *
 * @returns { success: false, image } if the image was stored successfully.
 */
export const storeImage = async (image: imageFile, category: string) => {
  const originalName = image.originalname;
  let imageUrl: string;
  let compressedImageUrl: string;

  try {
    const existingImage = await Image.findOne({ filename: originalName });
    if (existingImage) {
      return { success: false, message: RESOURCE_ALREADY_EXISTS };
    }
  } catch (error) {
    return { success: false, message: DATABASE_ERROR };
  }

  try {
    const compressedImageBuffer = await sharp(image.buffer)
      .resize(600, 600)
      .toFormat("jpg")
      .toBuffer();

    const compressedImage: imageFile = {
      originalname: image.originalname,
      buffer: compressedImageBuffer,
    };

    const [imageResult, compressedImageresult] = await Promise.all([
      storage.storeImage(image),
      storage.storeCompressedImage(compressedImage),
    ]);

    if (!(imageResult.url && compressedImageresult.url)) {
      return { success: false, message: FILE_SYSTEM_ERROR };
    }

    imageUrl = imageResult.url;
    compressedImageUrl = compressedImageresult.url;
  } catch (error) {
    return { success: false, message: FILE_SYSTEM_ERROR };
  }

  const storedImage: IImageDocument = new Image({
    filename: originalName,
    imageUrl: imageUrl,
    compressedImageUrl: compressedImageUrl,
    category: category.toLowerCase(),
  });

  try {
    await storedImage.save();
  } catch (err) {
    console.trace(err);
    return { success: false, message: DATABASE_ERROR };
  }

  return { success: true, image: storedImage };
};

/**
 * Deletes an image from the database and the file system.
 *
 * @param imageId The id of the image to delete.
 *
 * @returns {success: true, image} if the image was deleted successfully.
 *
 * @returns {success: false, message} if the image could not be deleted successfully.
 */
export const deleteImage = async (imageId: string) => {
  // let image: IImageDocument | null;
  // try {
  //   image = await Image.findById(imageId);
  // } catch (err) {
  //   return { success: false, message: DATABASE_ERROR };
  // }
  // if (!image) {
  //   return { success: false, message: RESOURCE_NOT_FOUND };
  // }
  // try {
  //   await unlink(image);
  // } catch (err) {
  //   return { success: false, message: FILE_SYSTEM_ERROR };
  // }
  // try {
  //   await image.delete();
  // } catch (err) {
  //   return { success: false, message: DATABASE_ERROR };
  // }
  // return { success: true, image: image };
};

/**
 * Deletes all images withing a given category.
 *
 * @param category The category within wich all images will be deleted.
 */
export const deleteImagesByCategory = async (category: string) => {
  // let imagesToDelete: IImageDocument[];
  // try {
  //   imagesToDelete = await Image.find({ category: category.toLowerCase() });
  // } catch (error) {
  //   return { success: false, message: DATABASE_ERROR };
  // }
  // const results = await Promise.all(
  //   imagesToDelete.map((image) => deleteImage(image._id))
  // );
  // const failedRequest: { success: boolean; message?: string } | undefined =
  //   results.find((res) => !res.success);
  // if (failedRequest) {
  //   return {
  //     success: false,
  //     message: failedRequest.message,
  //   };
  // }
  // return {
  //   success: true,
  // };
};
