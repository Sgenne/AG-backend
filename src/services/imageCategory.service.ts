import { DATABASE_ERROR, RESOURCE_ALREADY_EXISTS, RESOURCE_NOT_FOUND } from ".";
import { IImage } from "../interfaces/image.interface";
import { IImageCategory } from "../interfaces/imageCategory.interface";
import { IImageCategoryDocument, ImageCategory } from "../models/imageCategory";
import * as imageServices from "./image.service";

/**
 * Returns all existing image categories.
 */
export const getImageCategories = async () => {
  let categories: IImageCategory[];
  try {
    categories = await ImageCategory.find().populate("previewImage");
  } catch (err) {
    return { success: false, message: DATABASE_ERROR };
  }

  return { success: true, categories: categories };
};

/**
 * Created an image category with the given title.
 *
 * @param title The title of the created image category.
 */
export const createImageCategory = async (title: string) => {
  let existingCategory: IImageCategory | undefined;

  try {
    await ImageCategory.find({ title: title });
  } catch (error) {
    return { success: false, message: DATABASE_ERROR };
  }

  if (existingCategory) {
    return { success: false, message: RESOURCE_ALREADY_EXISTS };
  }

  const category = new ImageCategory({
    title: title.toLowerCase(),
  });

  try {
    await category.save();
  } catch (error) {
    return { success: false, message: DATABASE_ERROR };
  }

  return { success: true, category: category };
};

/**
 * Deletes an image category and all images within it.
 *
 * @param categoryId The category of the image to delete.
 */
export const deleteImageCategory = async (categoryId: string) => {
  let category: IImageCategory | null;

  try {
    category = await ImageCategory.findByIdAndDelete(categoryId);
  } catch (error) {
    return { success: false, message: DATABASE_ERROR };
  }

  if (!category) {
    return { success: false, message: RESOURCE_NOT_FOUND };
  }

  const deleteImagesResult = await imageServices.deleteImagesByCategory(
    category.title
  );

  if (!deleteImagesResult.success) {
    return deleteImagesResult;
  }

  return { success: true };
};

/**
 * Updates the preview image of an image category.
 *
 * @param previewImageId The image-id of the new preview image
 *
 * @param categoryId The id of the image category that will be updated.
 */
export const setCategoryPreviewImage = async (
  previewImageId: string,
  categoryId: string
) => {
  let previewImage: IImage | null | undefined;
  let category: IImageCategoryDocument | null;

  // Fetch preview image and image category from DB.
  try {
    [{ image: previewImage }, category] = await Promise.all([
      imageServices.getImageById(previewImageId),
      ImageCategory.findById(categoryId),
    ]);
  } catch (err) {
    return { success: false, message: DATABASE_ERROR };
  }

  if (!(category && previewImage)) {
    return { success: false, message: RESOURCE_NOT_FOUND };
  }

  category.previewImage = previewImage;

  try {
    await category.save();
  } catch (err) {
    return { success: false, message: DATABASE_ERROR };
  }

  return { success: true, category: category };
};
