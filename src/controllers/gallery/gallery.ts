import { Request, Response } from "express";

import { ImageCategory } from "../../models/imageCategory";
import { ScrollingImage } from "../../models/scrollingImage";
import * as imageServices from "../../services/image.service";
import * as imageCategoryServices from "../../services/imageCategory.service";

export const getImages = async (req: Request, res: Response) => {
  const [imageResult, categoryResult] = await Promise.all([
    imageServices.getImages(),
    imageCategoryServices.getImageCategories(),
  ]);

  if (!(imageResult.success && categoryResult.success)) {
    return res
      .status(500)
      .json({ message: "Could not fetch images from database." });
  }

  res.json({
    message: "Successfully fetched images.",
    images: imageResult.images,
    categories: categoryResult.categories,
  });
};

export const getImagesByCategory = async (req: Request, res: Response) => {
  const category = req.params.category;

  const [imageResult, categoryResult] = await Promise.all([
    imageServices.getImagesByCategory(category),
    imageCategoryServices.getImageCategories(),
  ]);

  if (!(imageResult.images && categoryResult.categories)) {
    return res
      .status(500)
      .json({ message: "Could not fetch images from database." });
  }

  const categories = categoryResult.categories;

  if (!categories.map((cat) => cat.title).includes(category)) {
    return res.status(404).json({ message: "No such category exists." });
  }

  res.status(200).json({
    message: "Successfully fetched images.",
    images: imageResult.images,
    categories: categories,
  });
};

export const getImageById = async (req: Request, res: Response) => {
  const imageId = req.params.imageId;

  const result = await imageServices.getImageById(imageId);

  if (!result.success) {
    return res
      .status(500)
      .json({ message: "Could not fetch the image from the database" });
  }

  if (!result.image) {
    return res
      .status(404)
      .json({ message: "No image with the given image id exists." });
  }

  res.status(200).json({
    message: "Image fetched succesfully.",
    image: result.image,
  });
};

export const getCategories = async (req: Request, res: Response) => {
  const result = await imageCategoryServices.getImageCategories();

  if (!result.categories) {
    return res.status(500).json({ message: "Could not fetch categories." });
  }

  res
    .status(200)
    .json({
      message: "The categories were fetched successfully.",
      categories: result.categories,
    });
};

export const getScrollingImages = async (req: Request, res: Response) => {
  try {
    const scrollingImages = await ScrollingImage.find().populate("image");
    res.status(200).json({
      message: "Successfully fetched scrolling images.",
      scrollingImages: scrollingImages,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Could not fetch scrolling images." });
  }
};
