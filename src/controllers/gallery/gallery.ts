import { Request, Response } from "express";

import { IImageDocument, Image } from "../../models/image";
import { ImageCategory } from "../../models/imageCategory";
import { ScrollingImage } from "../../models/scrollingImage";
import { IImage } from "../../models/image";
import { IImageCategory } from "../../models/imageCategory";

const _fetchImages = (
  imageQuery = {}
): Promise<[IImage[], IImageCategory[]]> => {
  return Promise.all([Image.find(imageQuery), ImageCategory.find()]);
};

export const getImages = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const [images, categories] = await _fetchImages();
    res.json({
      message: "Successfully fetched images.",
      images: images,
      categories: categories,
    });
  } catch (err) {
    const error = new Error("Something went wrong while fetching images.");
    res.status(500);
    return next(error);
  }
};

export const getImagesByCategory = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const category = req.params.category;
  try {
    const [categoryImages, categories]: [IImage[], IImageCategory[]] =
      await _fetchImages({ category: category });
    res.status(200).json({
      message: "Successfully fetched images.",
      images: categoryImages,
      categories: categories,
    });
  } catch (err) {
    const error = new Error("Something went wrong while fetching images.");
    res.status(500);
    return next(error);
  }
};

export const getImageById = async (
  req: Request,
  res: Response,
  next: Function
) => {
  let image: IImage | null;
  const imageId = req.params.imageId;

  try {
    image = await Image.findById(imageId);
  } catch (err) {
    const error = new Error("Could not fetch the image.");
    res.status(500);
    return next(error);
  }

  if (!image) {
    const error = new Error("No image with the given image id exists.");
    res.status(404);
    return next(error);
  }

  res.status(200).json({
    message: "Image fetched succesfully.",
    image: image,
  });
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: Function
) => {
  let categories;
  try {
    categories = await ImageCategory.find().populate("previewImage");
  } catch (err) {
    const error = new Error("Something went wrong while fetching categories.");
    res.status(500);
    return next(error);
  }
  res.status(200).json({
    message: "Categories fetched successfully.",
    categories: categories,
  });
};

export const getScrollingImages = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const scrollingImages = await ScrollingImage.find().populate("image");
    res.status(200).json({
      message: "Successfully fetched scrolling images.",
      scrollingImages: scrollingImages,
    });
  } catch (error) {
    error = new Error("Could not fetch scrolling images.");
    res.status(500);
    return next(error);
  }
};
