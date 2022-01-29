import { Request, Response } from "express";

import {
  ImageCategory,
  IImageCategoryDocument,
} from "../../models/imageCategory";
import { IImage } from "../../interfaces/image.interface";
import { IImageCategory } from "../../interfaces/imageCategory.interface";

import { ScrollingImage } from "../../models/scrollingImage";
import { IScrollingImage } from "../../interfaces/scrollingImage.interface";
import * as imageServices from "../../services/image.service";
import * as imageCategoryServices from "../../services/imageCategory.service";
import { RESOURCE_ALREADY_EXISTS, RESOURCE_NOT_FOUND } from "../../services";

export const createCategory = async (req: Request, res: Response) => {
  const categoryTitle = req.body.categoryTitle;

  const result = await imageCategoryServices.createImageCategory(categoryTitle);

  if (!result.category) {
    if (result.message === RESOURCE_ALREADY_EXISTS) {
      return res
        .status(403)
        .json({ message: "A category with the given title already exists." });
    }
    return res
      .status(500)
      .json({ message: "The image category could not be created." });
  }

  res.status(201).json({
    message: "The image category was successfully created.",
    category: result.category,
  });
};

export const deleteCategory = async (req: Request, res: Response) => {
  // The id of the category to be deleted.
  const categoryId: string = req.body.categoryId;

  const result = await imageCategoryServices.deleteImageCategory(categoryId);

  if (!result.success) {
    if (result.message === RESOURCE_NOT_FOUND) {
      return res.status(404).json({ message: "No such image category exists" });
    }
    return res
      .status(500)
      .json({ message: "The image category could not be deleted." });
  }

  res.status(200).json({
    message: "Category deleted successfully.",
  });
};

export const setImageCategoryPreviewImage = async (
  req: Request,
  res: Response
) => {
  const previewImageId = req.body.previewImageId;
  const categoryId = req.body.categoryId;

  const result = await imageCategoryServices.setCategoryPreviewImage(
    previewImageId,
    categoryId
  );

  if (!result.success) {
    if (result.message === RESOURCE_NOT_FOUND) {
      return res.status(404).json({ message: "Resource could not be found" });
    }
    return res
      .status(500)
      .json({ message: "The image category could not be updated." });
  }

  res.status(200).json({
    message: "Category preview image updated successfully.",
    category: result.category,
  });
};

// verifies an uploaded image, adds compressed version, and stores to file system and database
export const handleUploadedImage = async (req: Request, res: Response) => {
  const category = req.body.category;

  if (!req.file) {
    return res.status(500).json({
      message: "Something went wrong. The image could not be uploaded.",
    });
  }

  const result = await imageServices.storeImage(req.file, category);

  if (!result.success) {
    return res.status(500).json({
      message: "Something went wrong. The image could not be uploaded.",
    });
  }

  res.status(200).json({
    message: "Image uploaded successfully.",
    image: result.image,
  });
};

export const deleteImage = async (req: Request, res: Response) => {
  const imageId: string = req.body.imageId;

  const result = await imageServices.deleteImage(imageId);

  if (!result.success) {
    if (result.message === RESOURCE_NOT_FOUND) {
      return res.status(404).json({
        message: "No image with the given id could be found.",
      });
    } else {
      return res.status(500).json({
        message: "The image could not be deleted.",
      });
    }
  }

  res.status(200).json({
    message: "The image was deleted successfully.",
    image: result.image,
  });
};

export const deleteScrollingImage = async (req: Request, res: Response) => {
  const scrollingImageId = req.body["scrolling-image-id"];

  const deletedScrollingImage: IScrollingImage | null =
    await ScrollingImage.findByIdAndDelete(scrollingImageId);

  // If no scrolling image with the given id could be found, then
  // return an error message.
  if (!deletedScrollingImage) {
    return res
      .status(404)
      .json({ message: "No scrolling image with the given id was found." });
  }

  res.status(200).json({
    message: "Image deleted successfully.",
  });
};

// Gets a list of the new scrolling image ids from the request body,
// and replaces the previous scrolling images. If any of the new
// scrolling images is not found, then the old scrolling images
// will remain.
export const replaceScrollingImages = async (req: Request, res: Response) => {
  // The ids of the images that will replace the current scrolling images,
  // in the order of appearance.
  const newScrollingImageIds: string[] = req.body.newScrollingImageIds;
  let newScrollingImages: ({} | null)[];

  try {
    // Fetch the new scrolling images from DB.
    newScrollingImages = await Promise.all(
      newScrollingImageIds.map((id) => Image.findById(id))
    );
  } catch (err) {
    return res.status(500).json({
      message:
        "The new scrolling images could not be fetched from the database.",
    });
  }

  // If any of the images were not found, return 404.
  if (newScrollingImages.some((image) => image === null)) {
    return res.status(404).json({
      message: "An image with the given image id could not be found.",
    });
  }

  // Create a function for each new scrolling image which produces the
  // new ScrollingImage object.
  const newScrollingImageFunctions: (() => Promise<void>)[] =
    newScrollingImages.map((image, index) => async () => {
      const newScrollingImage = new ScrollingImage({
        image: image,
        order: index,
      });
      await newScrollingImage.save();
    });

  try {
    // Delete previous scrolling images.
    await ScrollingImage.deleteMany();

    // Create new ScrollingImage objects.
    await Promise.all(newScrollingImageFunctions.map((func) => func()));
  } catch (err) {
    return res.status(500).json({
      message: "Could not update database with new scrolling images.",
    });
  }

  res.status(200).json({ message: "Scrolling images succesfully replaced." });
};
