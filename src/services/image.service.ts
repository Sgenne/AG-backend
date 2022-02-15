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
import { Result } from "../interfaces/result.interface";

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

  const storage = createStorageHandler();

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

    imageUrl = imageResult.payload.url;
    compressedImageUrl = compressedImageresult.payload.url;

    if (!(imageUrl && compressedImageUrl)) {
      return { success: false, message: FILE_SYSTEM_ERROR };
    }
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
  let image: IImageDocument | null;

  console.log("here")

  const storage: StorageHandler = createStorageHandler();

  try {
    image = await Image.findById(imageId);
  } catch (err) {
    return { success: false, message: DATABASE_ERROR };
  }

  if (!image) {
    return { success: false, message: RESOURCE_NOT_FOUND };
  }

  try {
    await Promise.all([
      storage.deleteImage(image),
      storage.deleteCompressedImage(image),
    ]);
  } catch (err) {
    return { success: false, message: FILE_SYSTEM_ERROR };
  }

  try {
    await image.delete();
  } catch (err) {
    return { success: false, message: DATABASE_ERROR };
  }

  return { success: true, image: image };
};

/**
 * Deletes all images withing a given category.
 *
 * @param category The category within wich all images will be deleted.
 */
export const deleteImagesByCategory = async (category: string) => {
  let imagesToDelete: IImageDocument[];

  const storage = createStorageHandler();

  try {
    imagesToDelete = await Image.find({ category: category.toLowerCase() });
  } catch (error) {
    return { success: false, message: DATABASE_ERROR };
  }

  const results = await Promise.all(
    imagesToDelete.map((image) =>
      Promise.all([
        storage.deleteImage(image),
        storage.deleteCompressedImage(image),
      ])
    )
  );

  let failedRequestResult: Result | undefined;

  results.forEach((res) => {
    if (!res[0].success) {
      failedRequestResult = res[0];
      return;
    }
    if (!res[1].success) {
      failedRequestResult = res[1];
    }
  });

  if (failedRequestResult) {
    return {
      success: false,
      message: failedRequestResult.message,
    };
  }

  return {
    success: true,
  };
};

const createStorageHandler = (): StorageHandler => {
  const keyFileName: string | undefined = process.env.GOOGLE_CLOUD_KEY_FILENAME;
  const bucketName: string | undefined = process.env.GOOGLE_CLOUD_BUCKET_NAME;

  if (!(keyFileName && bucketName)) {
    throw new Error(
      `Invalid google cloud credentials: ${keyFileName} - ${bucketName}`
    );
  }

  return new StorageHandler(keyFileName, bucketName);
};
