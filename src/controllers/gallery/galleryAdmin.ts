import { Request, Response } from "express";

import * as imageServices from "../../services/image.service";
import * as imageCategoryServices from "../../services/imageCategory.service";
import * as scrollingImageServices from "../../services/scrollingImage.service";
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

export const replaceScrollingImages = async (req: Request, res: Response) => {
  // The ids of the images that will replace the current scrolling images,
  // in the order of appearance.
  const newScrollingImageIds: string[] = req.body.newScrollingImageIds;

  const result = await scrollingImageServices.replaceScrollingImages(
    newScrollingImageIds
  );

  if (!result.success) {
    if (result.message === RESOURCE_NOT_FOUND) {
      return res.status(404).json({ message: "Image not found" });
    }
    return res
      .status(500)
      .json({ message: "Scrolling image could not be replaced." });
  }

  res.status(200).json({
    message: "Scrolling images succesfully replaced.",
    scrollingImages: result.scrollingImages,
  });
};
