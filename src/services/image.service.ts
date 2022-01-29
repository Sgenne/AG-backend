import { Image } from "../models/image";
import { IImage } from "../interfaces/image.interface";
import { DATABASE_ERROR } from ".";

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
 * @returns {success: true, images} if all images within the
 * given category were returned successfully (even if no images
 * are found).
 *
 * @returns {success: false, message} if the images could not be fetched.
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
 *
 * @returns {success: true, image} if the image with the
 * given image-id was returned successfully. Even if no image was found.
 *
 * @returns {success: false, message} if the image could not be returned
 * due to an error.
 */
export const getImageById = async (
  imageId: string
): Promise<{
  success: boolean;
  image?: IImage | null;
  message?: string;
}> => {
  let image: IImage | null;

  try {
    image = await Image.findById(imageId);
  } catch (error) {
    return { success: false, message: DATABASE_ERROR };
  }
  return { success: true, image: image };
};
